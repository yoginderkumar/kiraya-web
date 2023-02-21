# Kiraya Web Application

This repository contains source code for Kiraya Web application. You can visit the desktop-web app at [https://kiraya.store](https://kiraya.store).

## Overview

Kiraya Web application is a renting platform to help users add their household items on the platform and make it easier for other users to rent instead of buying stuff to save their money..

## Technology Stack

This is a **Monorepo of Single Page Applications**. This project was generated using [Nx](https://nx.dev) with **TypeScript**. We are using [reactfire](https://github.com/FirebaseExtended/reactfire) to connect with our Firebase based backend.

Following are the primary technologies used throughout different apps.

- **[TypeScript](https://www.typescriptlang.org/) (^4) :** Programming Language
- **[React](https://reactjs.org/docs/hello-world.html) (^18) :** UI Library (with [suspense](https://reactjs.org/docs/concurrent-mode-suspense.html))
- **[React-Router-Dom](https://reactrouter.com/desktop-web/guides/quick-start) (^6-beta) :** Routing/Navigation
- **[Tailwindcss](https://tailwindcss.com/) (^2) :** CSS
- **[ReactFire](https://github.com/FirebaseExtended/reactfire) (^3-rc) :** React-Firebase helper
- **[Formik](https://formik.org/docs/overview) (^2) :** Input Forms
- **[Yup](https://github.com/jquense/yup#readme) (^0.32) :** Input Validation
- **[Jest](https://jestjs.io/docs/getting-started) (^26) :** Unit Testing
- **[Sentry](https://docs.sentry.io/platforms/javascript/usage/) (^5) :** Error Reporting
- **[Segment](https://segment.com/docs/connections/sources/catalog/libraries/desktop-website/javascript/) :** Analytics and Tracking

There are other some technologies used like `date-fns`, `date-picker` but above stack has the majority of contribution.

## Source Code Structure

Most of the application code resides in `/apps` directory where you will be spending most of your time.

```
- /apps => All our apps resides in the directory
  - /kiraya => Our desktop web aplication
- /libs => Commonly used shared library accross our web apps, namespaced under "cashbook"
  - /util-dates => Date/Time utilities, importable using "@kiraya/util-dates"
  - /util-logging => Error or General logging utilities
  - /util-general => General utilities
  - /web => Shared web libraries
    - /icons => Icons for our web application

- /tailwind.base.config.js => Tailwindcss configuration (colors, spacing, fonts etc.) file
- /.github => Github workflows and templates
```

## Contribution

Before starting any kind of contribution, please make sure you are familiar with the underline technology used in the project. For example, if you want to contribute to CSS, please make sure you have a good understanding of Tailwindcss. If your contribution requires a new technology/utility, please get a good grasp and provide details regarding it to the maintainers.

To start contributing, please following these steps.

### 1. Setup Locally

Make sure you have following requirements installed on your machine.

#### System Prerequisites

- `node` `>=16`
- `npm` `>=8`

Now create a fork of this repository to your account. Once forked, follow these steps to setup your development
environment.

```bash
# clone the repository from your account to your local machine
git clone git@github.com:<username>/kiraya-web.git
# change working directory
cd kiraya-web
# install the dependencies
npm i
# start the development preview server
npm start
```

> In most cases, it will automatically open your browser with the prompted url

This should prompt you with a preview url (e.g. http://localhost:3000) which you should open in your browser (Google Chrome Preferred).

### 2. Testing Account Creation

After you have locally setup the app, you will need an account to login into the application. Please ask the maintainers to create a testing account for you. You will be provided a Phone number along with OTP. Use these credentials every time you need to login into the application.

### 3. Develop and Test your specs

Now you are ready to develop. You should gather all the specs required for the implementation and test it out after development. Here are common contributions and how to start one.

### 4. Create Merge Requests

- Once you have implemented the specs, you should push these **changes to your remote** (forked repository to your account).
- Create a PR to the `alluzo/kiraya-web` repository on the `test` branch from the pushed branch.
- Provide full description of why/what/how you have implemented the specs along with directions of any specific test cases.
- Your PR will be reviewed and any necessary feedback will be provided.

> **Note** Your first pull request **MUST** be made to the `test` branch of main upstream.

## Developer Guidelines

### Mindset

- Keep the code close to its usage.
- Don't create new files if not necessary.
- Keep simiplicity over modularity/DRY. Sometimes modularity is simple. Sometimes copy-paste.
- Emphasise over deterministic code.

### Contribution

- Reduce the use of className whenever possible.
- Consult with the design team for any added new design token (color, spacing etc). Ask if they can use any existing one
- Use Stack component to give gaps between elements instead of margin or padding whenever possible
- Avoid giving outer or inner spacing (i.e. paddings) to Text element. That's why Text component doesn't accept a margin or padding prop.
- Before making a function as general utility, think twice. General utility functions don't involve our business logic. When putting something there, check if the utility can be used as an open-source utility. If not, think agin and then only put something here.
- Try to refactor the code if there are too many flows and code becomes hard to follow.
- Use composition of different components instead of adding complexity in single one. Create new ones if necessary.

## FAQs

### How to update CSS/Styles ?

- To update css for an existing element, simply update the `className` property of your desired element.
- If you want to change the theme (e.g. colors, spacings, font-size etc.), you should update the `tailwind.base.config.js` present in the root directory. If you are updating any existing key, make sure to update the corresponding class name across the project i.e. if you update the shades of blue-500 to blue-600 (removed blue-500), you must update all occurrence of blue-500 (text color, background color, border color) to the new color.
- If you want to add global utility, component then update the `index.css` file with your desired styles in the desired application. User Tailwindcss's `@layer components` or `@layer utilities` to add these type of styles for bug free preferences of our final css.
