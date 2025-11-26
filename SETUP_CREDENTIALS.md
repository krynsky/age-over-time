# Google Cloud Credentials Setup Guide

To use the **Nano Banana Pro** model (via Vertex AI), you need to set up a Google Cloud project and generate a Service Account key.

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top of the page.
3. Click **New Project**.
4. Enter a project name (e.g., `age-over-time-app`) and click **Create**.
5. Select your new project from the dropdown.

## 2. Enable Vertex AI API
1. In the search bar at the top, type **Vertex AI API**.
2. Click on **Vertex AI API** from the results.
3. Click **Enable**.

## 3. Create a Service Account
1. In the left sidebar, go to **IAM & Admin** > **Service Accounts**.
2. Click **+ CREATE SERVICE ACCOUNT**.
3. Enter a name (e.g., `app-service-account`) and click **Create and Continue**.
4. In the **Select a role** dropdown, choose **Vertex AI** > **Vertex AI User**.
5. Click **Continue** and then **Done**.

## 4. Generate a Key
1. In the Service Accounts list, click on the email address of the service account you just created.
2. Go to the **Keys** tab.
3. Click **ADD KEY** > **Create new key**.
4. Select **JSON** and click **Create**.
5. A JSON file will automatically download to your computer.

## 5. Configure the Application
1. Move the downloaded JSON file to the `c:\AI\pinokio\api\age-over-time` directory.
2. Rename the file to `service-account-key.json` (or update the `.env` file with the actual filename).
3. Create a file named `.env` in the `c:\AI\pinokio\api\age-over-time` directory with the following content:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json
```

> **Note**: Replace `your-project-id` with your actual Project ID (found in the Google Cloud Console dashboard).

## 6. Restart the Server
After setting up the `.env` file, restart the server for the changes to take effect.
