
## Demo
- User Page
  ![screenshot](/public/images/demo%20web.png)
- Admin Page
  ![screenshot](/public/images/demo%20admin.png)
## Technology

The application is built with:

- Node.js
- MongoDB
- Express

## Features

The application displays a virtual bags store that contains virtual products and contact information.

Users can do the following:

- Create an account, login or logout
- Browse available products added by the admin
- Add products to the shopping cart
- Delete products from the shopping cart
- Display the shopping cart
- To checkout
- Checkout information is processed using stripe and the payment is send to the admin
- The profile contains all the orders a user has made
  -upload image profile
  Admins can do the following:
- Send email to reset password
- Login or logout to the admin panel
- View all the information stored in the database. They can view/add/edit/delete orders, users, products . The cart model cannot be modified by an admin because a cart is either modified by the logged in user before the purchase or deleted after the purchase.
