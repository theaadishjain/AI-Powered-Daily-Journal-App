# AI Journal

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
```

Replace the values with your actual Gemini API key and MongoDB URI.

## Sample Journal Entry

**Entry:**
```
Today I went for a walk in the park and enjoyed the sunshine. I felt really relaxed and happy to be outside.
```
**Generated Summary:**
> Went for a walk in the park, enjoyed the sunshine, and felt relaxed and happy.

**Detected Mood:**
> Happy

## Deployment

- **Backend:** Deploy the `backend` folder to [Render](https://render.com/). Set the environment variables in the Render dashboard.
- **Frontend:** Deploy the `frontend` folder to [Vercel](https://vercel.com/). Set the backend API URL in the frontend if needed.

**Live Link:**
> [Your deployed app link here] 