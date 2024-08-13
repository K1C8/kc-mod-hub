import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import modupload from "./modupload.mjs";
import path from "path";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  console.log(req.auth.payload)
  // we are using the audience to get the email and name from the token
  // if your audience is different you should change the key to match your audience
  // the value should match your audience according to this document: https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit#heading=h.fr3s9fjui5yn
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.get('/get-contents', async (req, res) => {
  try {
    // Fetch all Content entries from the database
    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
        file: true,
        image: true,
        lastUpdateTime: true,
        desc: true,
      },
      orderBy: {
        lastUpdateTime: 'desc',
      },
    });

    // Send the fetched data as the response
    res.status(200).json(contents);
  } catch (error) {
    // Handle errors
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch user's subscribed files. This endpoint requires authentication to be called.
app.get("/get-user-subscription", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;
  
});


// Use ModUpload middleware for handling mod uploads
app.post('/upload-mod', modupload.single('file'), (req, res) => {
  console.log(req.file.filename);
  if (!req.file) {
    console.log("Bad request received.");
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Respond with file details
  res.status(200).json({
    file: req.file.filename,
    path: req.file.path
  });
});


// const imgDirPath = "./"
// const modDirPath = "./"

// Serve static files from the 'img_uploads' directory
app.use('/img_uploads', express.static('img_uploads'));

// Serve static files from the 'img_uploads' directory
app.use('/mod_uploads', express.static('mod_uploads'));



app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
