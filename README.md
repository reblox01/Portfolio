# Portfolio

![Thumbnail](https://github.com/reblox01/Portfolio/blob/79389644b6533771271ca6bd281a82fd5ebbe595/public/Thumbnail.png)

## Overview

Welcome to the **Portfolio** GitHub repository! This project is designed to provide developers with a fully functional full-stack portfolio template featuring an admin login. With this repository, developers can easily set up their own portfolio websites, customize them to their liking, and manage their portfolio content through a user-friendly UI.

This project is aimed at developers who want to showcase their work in a professional and customizable manner. By utilizing this repository, developers can create their portfolio websites without having to start from scratch. The portfolio includes features such as:

- Admin login functionality
- User-friendly interface for managing portfolio content
- Customizable design and layout
- Full-stack capabilities

## Getting Started

To get started with using this portfolio template, follow these steps:

## 1. **Clone the Repository**: 
Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/reblox01/Portfolio.git
   ```

## 2. **Install Dependencies**: 
Navigate into the project directory and install the necessary dependencies for both the frontend and backend:

   ```bash
   cd Portfolio
   npm install
   ```

## 3. **Configure Environment Variables**: 
Set up your environment variables for the backend. You can do this by creating a `.env` file in the root directory of the project and adding the necessary variables. Refer to the `.env` file for guidance.

- .env example template

```bash
DATABASE_URL=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_UPLOAD_PRESET=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

ADMIN_USER_ID=
```

Before running the application, you need to set up environment variables and configure external services. Follow these steps:

1. **MongoDB Configuration**:

   - Go to [MongoDB](https://www.mongodb.com/) and create a new database.
   - Obtain the connection URL for your database and enclose it with double quotes.
   - Add the connection URL to the `.env` file under the `DATABASE_URL` variable like so:

     ```
     DATABASE_URL="mongodb+srv://your-db-url"
     ```

2. **Cloudinary Configuration**:

   - Sign up or login to [Cloudinary](https://cloudinary.com/).
   - Get your cloud name from Cloudinary and add it to the `.env` file under the `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` variable.
   - Go to Cloudinary settings and navigate to Upload presets.
   - Create a new upload preset and specify the folder name where you want to save your images (e.g., "My-portfolio").
   - Save the new preset and add its name to the `.env` file under the `NEXT_PUBLIC_UPLOAD_PRESET` variable.
   - **note**: Make sure to go to `settings` and then `security` and make sure that `PDF and ZIP files delivery` is activated.

3. **Clerk Configuration**:

   - Sign up or sign in to [Clerk](https://clerk.com/).
   - Create a new application with your desired name (e.g., "Portfolio").
   - Keep Google login enabled.
   - Obtain the Clerk publishable key and secret key.
   - Add the keys to the `.env` file under the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` variables.
   - Additionally, add the following Clerk URLs to the `.env` file:

     ```
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
     ```

4. **Admin User Configuration**:

   - run `npm run dev` and `login` with an account that you want to designate as the admin.
   - And then go back to Clerk settings and navigate to the Users section.
   - Copy the user ID of the admin account.
   - Add the user ID to the `.env` file under the `ADMIN_USER_ID` variable.
   - Then only first time navigate through searchbar to `/admin-dashboard/manage-admin/` as you don't have a admin added yet.
     
5. **Change title,description,favicon**:
   To set up the title, description, and favicon/logo:

   - **Open** `site.config.ts`.
   - **Update** the `Your name` field with your name followed by " - Portfolio" for the title.
   - **Adjust** the `description` field with your description.
   - **Specify** the path to your logo image in the `logo` object's `url` and `href` properties.
   - **Ensure** your favicon or logo image is placed in the `public` folder.

These changes will reflect the title, description, and logo/favicon of your portfolio website.


6. **Contact Configurantion SMTP**:
- Enable Two-Factor Authentication (2FA)
  - Go to your [Google Account](https://myaccount.google.com/).
   - Click on **Security** in the left sidebar.
   - Under **Signing in to Google**, enable **2-Step Verification** if it is not already enabled.
   - Follow the prompts to set up 2FA using your preferred method (phone, app, etc.).

- Generate an App Password
   - After enabling 2FA, return to the **Security** section.
   - Under **Signing in to Google**, click on **App passwords**.
   - You may need to re-enter your password to access this section.
   - Select **Mail** as the app and **Other (Custom name)** for the device. Enter a name that helps you remember the purpose (e.g., "MyApp SMTP").
   - Click **Generate**.
   - Google will provide a 16-character app password. **Copy this password** — you will need it for your application.
     
 - Config Contact in Dashboard Admin
   - Go to you **Dashboard**
   - **Contact** then you can just add you contact infos by **Add New Contact**
   - Make sure that you inserted a valid **password** for the **email** the email that you used


7. **Final Steps**:
   - Save all changes to the `.env` file.
   - Run the application again using `npm run dev`.

If you encounter any issues during setup or have any questions, feel free to reach out for assistance.

## 4. **Run the Application**: 
Once the dependencies are installed and the environment variables are configured, you can run the application. Run the following command from the root directory:

   ```bash
   npm run dev
   ```

## 5. **Access the Application**: 
Once the application is running, you can access it in your web browser at `http://localhost:3000`.

   # Note: Parallax Effect on Homepage enables after adding atleast 4 projects to your portfolio

## Deploy on vercel

To deploy your portfolio project on Vercel using the Vercel, follow these steps:

1. **Sign in to Vercel**: Visit the [Vercel website](https://vercel.com/) and sign in to your Vercel account.

2. **Import Project**: Once signed in, you'll land on your dashboard. Click on the "Import Project" button.

3. **Choose Git Repository**: Select the Git repository hosting your portfolio project (e.g., GitHub).

4. **Authorize Access**: If prompted, authorize Vercel to access your Git repository.

5. **Configure Project Settings**:

   - Choose the repository where your project is hosted.
   - Make sure to set up the environment variables as specified in your project's README.md file.
   - Click "Continue" to proceed.

6. **Deploy**: After configuring the settings, click on the "Deploy" button to start the deployment process.

7. **Monitor Deployment**: Vercel will begin deploying your project. You can monitor the deployment progress on the Vercel dashboard.

8. **Access Your Deployed Site**: Once the deployment is complete, Vercel will provide you with a unique URL where your site is hosted. You can access your deployed portfolio website using this URL.

That's it! Your portfolio project is now deployed on Vercel using the Vercel. You can continue to manage your project and monitor deployments from your Vercel dashboard.

## Usage

After setting up the application, you can start customizing your portfolio. Here are some key points to keep in mind:

- **Admin Login**: Access the admin dashboard and logging in with your credentials.
- **Manage Portfolio Content**: Use the admin dashboard to add, edit, or remove portfolio items such as projects, techstack, certification, admin info or any other content you want to showcase.
- **Customize Design**: Modify the frontend components and styles to customize the look and feel of your portfolio.
- **Extend Functionality**: Feel free to extend the functionality of the portfolio by adding new features or integrating with external services.


## Support

If you find this project helpful and would like to support its development, you can buy me a coffee:

<a href="https://www.buymeacoffee.com/arosck1"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=arosck1&button_colour=BD5FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" /></a>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any inquiries or support, please contact [sohailkoutari@gmail.com](mailto:sohailkoutari@gmail.com).

## Acknowledgements

Thank you to everyone who has supported and contributed to this project. Your feedback and assistance are invaluable.
