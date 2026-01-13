# Agentic change of the router system for Swiftx router module

## Goal

Enhance the Swiftx router module to support complex routing resolutions through distinct routing groups and policies. 
The system should automatically evaluate context information and cookies to determine the optimal route when necessary. 
Additionally, different route groups should support independent policies, rules, and layout components.

## Current System

The current router system is based on the following structure:

```yaml
Browser Router
    - Route Stack
        - Root Path
        - Route Rules
            - Route Rule
            - Route Rule
            - ...
        - Layout Component (optional)
```

A route stack and its rules use a mix of declarative and fluent API to define the route resolution process.

```js
import { RouterStack, Route } from 'swiftx';
import Login from './Login';
import Home from './Home';
import About from './About';
import NotFound from './NotFound';
import RootLayout from './LoginLayout';

const context = { .. };

RouterStack(
    '/', [
        Route.on('/login').then(({ navigation }) => {
            const cookies = document.cookie;
            const token = cookies.split('token=')[1];
            if (token) {
                navigation.replace('/home');
            } else {
                navigation.replace('/login');
            }
        }),
        Route.on('/home').render(Home),
        Route.on('/expense/:id').render(Expense),
        Route.on('/about').render(({ navigation }) => <About navigation={navigation} context={context}/>),
        Route.notFound.render(NotFound)
    ],
    RootLayout
)
```

With this current configuration, the navigation property injected into routes is able to navigate using these capabilities:

```js
navigation.replace('/path'); // Replaces the current route with the new one
navigation.push('/path'); // Pushes the new route to the stack
navigation.back(fallback?); // Navigates back to the previous route or fallback to a path if no previous navigated entry exists in browser history
navigation.currentPath; // Reactive state of the current path
navigation.rootPath; // Reactive state of the root path
```

## Current Limitations

The current system is simple and effective for basic routing needs, but it lacks the flexibility and scalability required for complex routing scenarios:
    - Different layouts for different routes
    - Robust policies for routes
    - Robust context and cookies handling
    - Auto redirection to a path based on context and cookies
    - Auto redirection to a path based on policies
    - Auto redirection based on found or not content

## New System

The new router system should be based on the following structure:

```yaml
Browser Router:
    - Router Root:
        - Context: Router Root Context inherited from defaults and merged with application provided context
        - Root Route Group: Stands for the root path '/'
            - Component: Component? (Component is optional only if policies are defined)
            - Policies:
                - Policy: (params: { context, navigation }) => void
                ...
            - Layout Component: Component?
        - Route Groups or Paths:
            - Route Group:
                - Root Path: String
                - Routes:
                    - Route:
                        - Path: String
                        - Component: Component
                    ...
                - Policies:
                    - Policy: (params: { context, navigation }) => void
                    ...
                - Layout Component: Component?
            ...
            - Route:
                - Path: String
            ...
```

The code to define a route group should be something like this:

```js
import Swiftx from 'swiftx';
import { BrowserRouter, RouterRoot, RouteGroup, Route, RoutePolicy } from 'swiftx/router';
import Login from './Login';
import CreateAccount from './CreateAccount';
import RecoverPassword from './RecoverPassword';
import UnloggedHome from './UnloggedHome';
import Home from './Home';
import About from './About';
import Account from './Account';
import ChangePassword from './ChangePassword';
import ChangeCreditCard from './ChangeCreditCard';
import NotFound from './NotFound';
import Forbidden from './Forbidden';
import LoginLayout from './LoginLayout';
import NavigationLayout from './NavigationLayout';

const appContext = RouterRoot.Context({
  user: null,
  permissions: [],

  helpers: {
    createAccount: () => {
      ...
    },
    recoverPassword: () => {
      ...
    },
    logout: () => {
      ...
    }
  }
});

const RootRouter = RouterRoot(
  appContext,
  // Root Route Group or Path
  RouteGroup.root(
    UnloggedHome,
    [
      RoutePolicy(({ context, navigation }) => {
        const { user, cookies } = context;
        const token = cookies.get('token');

        if (user || token) {
          navigation.replace('/home');
        }
      })
    ]
  ),
  // Route Groups or Paths
  [
    // Default routes
    RouteGroup(
      '/home',
      [
        Route('/home', Home),
        Route('/about', About),
        Route('/account', Account),
        Route('/change-password', ChangePassword),
        Route('/change-credit-card', ChangeCreditCard),
        Route('/logout'),
      ],
      [
        RoutePolicy(({ context, navigation }) => {
          const { user, permissions, cookies } = context;

          if (navigation.path === '/logout') {
            context.remove('user', 'permissions');
            cookies.remove('token');
            navigation.replace('/login');
            return;
          }

          if (!user) {
            navigation.replace('/login');
            return;
          }

          if (!permissions.includes('change-credit-card')) {
            navigation.replace(Route.forbidden);
            return;
          }
        })
      ],
      NavigationLayout
    ),
    // Authentication routes
    RouteGroup(
      '/login',
      [
        Route('/login', Login),
        Route('/create-account', CreateAccount),
        Route('/recover-password', RecoverPassword)
      ],
      [
        RoutePolicy(({ context, navigation }) => {
          const { user, cookies } = context;
          const token = cookies.get('token');

          if (navigation.path === '/recover-password' && token) {
            navigation.replace('/change-password');
            return;
          }

          if (navigation.path === '/create-account' && token) {
            navigation.replace('/account');
            return;
          }

          if (user || token) {
            navigation.replace('/home');
          } else {
            navigation.replace('/login');
          }

          return;
        })
      ],
      LoginLayout
    ),
    Route.notFound(NotFound),
    Route.forbidden(Forbidden)
  ]
);

return BrowserRouter(RootRouter);

```

The same code above can be written in swiftx short syntax as:

```js
import Swiftx from 'swiftx';
... other imports
const { browser, root, group, route, policy } = Swiftx.Router; // proxies auto resolved to 'swiftx/router' components

return browser(
  root(appContext,
    // Root Route Group or Path
    group.root(UnloggedHome, [
      policy(({ context, navigation }) => {
        const { user, cookies } = context;
        const token = cookies.get('token');

        if (user || token) {
          navigation.replace('/home');
        }
      })
    ]),
    // Route Groups or Paths
    [
      group('/home', [
        route('/home', Home),
        route('/about', About),
        route('/account', Account),
        route('/change-password', ChangePassword),
        route('/change-credit-card', ChangeCreditCard),
        route('/logout'),
      ], [
        policy(({ context, navigation }) => {
          const { user, permissions, cookies } = context;

          if (navigation.path === '/logout') {
            context.remove('user', 'permissions');
            cookies.remove('token');
            navigation.replace('/login');
            return;
          }

          if (!user) {
            navigation.replace('/login');
            return;
          }

          if (!permissions.includes('change-credit-card')) {
            navigation.replace(route.forbidden);
            return;
          }
        })
      ], NavigationLayout),
      // Authentication routes
      group('/login', [
        route('/login', Login),
        route('/create-account', CreateAccount),
        route('/recover-password', RecoverPassword)
      ], [
        policy(({ context, navigation }) => {
          const { user, cookies } = context;
          const token = cookies.get('token');

          if (navigation.path === '/recover-password' && token) {
            navigation.replace('/change-password');
            return;
          }

          if (navigation.path === '/create-account' && token) {
            navigation.replace('/account');
            return;
          }

          if (user || token) {
            navigation.replace('/home');
          } else {
            navigation.replace('/login');
          }

          return;
        })
      ], LoginLayout),
      route.notFound(NotFound),
      route.forbidden(Forbidden)
    ]
  )
);

```

Group and Route can define the "/" root app path using the shorthand `group.root` and `route.root`.
These shorthands are proxies to `group("/", [...])` and `route("/", ...)`.

```js
// Group for root path only relying on policies
group.root([
    policy(({ context, navigation }) => {
        const { user, cookies } = context;
        const token = cookies.get('token');

        if (user || token) {
            navigation.replace('/home');
        }
    })
]);
```

```js
// Path for root path only relying on Component
route.root(Home);
```

Route path parameters are still supported and can be accessed through the navigation object.

```js
group('/expenses', [
  route('/expenses', Expenses),
  route('/expense/:expenseId', Expense),
  route('/expense/merge/:expenseId/:expenseId2', MergeExpense),
], [
  policy(({ context, navigation }) => {
    const { expenses } = context;
    const { params } = navigation;
    const { expenseId, expenseId2 } = params;

    const expense1Exists = (expenses && expenses.length > 0) ? expenses.find(expense => expense.id === expenseId) : false;
    const expense2Exists = (expenses && expenses.length > 0) ? expenses.find(expense => expense.id === expenseId2) : false;

    if (navigation.path === '/expense/:expenseId' && !expense1Exists) {
      navigation.replace(route.notFound);
      return;
    }

    if (navigation.path === '/expense/merge/:expenseId/:expenseId2' && (!expense1Exists || !expense2Exists)) {
      navigation.replace('/expenses');
      return;
    }
  })
], ExpenseLayout)
```

The default context parameter will always provide the following properties:

```js
context.cookies; // Cookies instance with set, get and remove methods
context.set(property, value); // Helper function to set property in context
context.remove(property); // Helper function to remove property from context
```

```js
export default function MergeExpenses({ context, navigation }) {
  const { expenses } = context;
  const { params } = navigation;
  const { expenseId, expenseId2 } = params;

  const handleMergeExpenses = () => {
    let mergedExpenses = [
      ...expenses.filter(expense => expense.id !== expenseId && expense.id !== expenseId2),
      {
        id: expenseId,
        name: expenses.find(expense => expense.id === expenseId).name,
        amount: expenses.find(expense => expense.id === expenseId).amount + expenses.find(expense => expense.id === expenseId2).amount
      }
    ];
    
    context.set('expenses', mergedExpenses);
    navigation.replace('/expenses');
  };

  return (
    <div>
      <h1>Expenses {expenseId} and {expenseId2} will be merged</h1>
      <button click={handleMergeExpenses}>Merge</button>
    </div>
  );
}
```

In this new scenario, navigation .back() function will consider current router group history, isolating navigation from other groups.
Also, if .back() function is called and there is no history, it will navigate to the root path of current router group.

```js
export default function Expenses({ context, navigation }) {
  const { expenses } = context;

  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            <a href={`/expense/${expense.id}`}>{expense.name}</a>
          </li>
        ))}
      </ul>
      <button click={navigation.back}>Back</button>
    </div>
  );
}
```

The navigation .replace() and .push() functions can now receive RoutePath.notFound and RoutePath.forbidden as parameters.

```js
navigation.replace(route.notFound);
navigation.push(route.forbidden);
```

The navigation object also will provide properties:

```js
navigation.path; // Reactive state of the current path
navigation.params; // Reactive state of the route parameters
navigation.group.rootPath; // Reactive state of the current group root path
```


## Basic Usage

- BrowserRouter

```js

// index.jsx

... other imports
import { BrowserRouter } from 'swiftx/router';

return (
  BrowserRouter(App)
);
```

- RouterRoot with only the root path

```js
// App.jsx

... other imports
import { RouterRoot, RouteGroup, RoutePolicy, Route } from 'swiftx/router';

return (
  RouterRoot(
    Route.root(Home)
  )
);
```
Note 1: RouterRoot omits the first context parameter since the app doesn't need to merge with its own context.
Note 2: The following groups and paths are optional, but the root group or path is always required.

- RouterRoot with the root path and extra paths

```js
// App.jsx

... other imports
import { RouterRoot, RouteGroup, RoutePolicy, Route } from 'swiftx/router';

return (
  RouterRoot(
    Route.root(Home), [
      Route('/expenses', Expenses),
      Route('/expense/:expenseId', Expense)
    ]
  )
);
```

- RouterRoot with the root group using paths and policies

```js
// App.jsx

... other imports
import { RouterRoot, RouteGroup, RoutePolicy, Route } from 'swiftx/router';

return (
  RouterRoot(
    RouteGroup.root([
      Route('/expenses', Expenses),
      Route('/expense/:expenseId', Expense),
    ], [
      RoutePolicy(({ context, navigation }) => {
        if (navigation.path === "/") {
          navigation.replace('/expenses');
        }
      }),
      RoutePolicy(({ context, navigation }) => {
        const { expenseId } = navigation.params;
        const { expenses } = context;

        if (!expenses.find(expense => expense.id === expenseId)) {
          navigation.replace('/expenses');
        }
      })
    ])
  )
);
```