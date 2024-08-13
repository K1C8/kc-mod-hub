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

async function getUserIdFromAuth0Id(auth0Id) {
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  return user.id;
}

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  // console.log(req.auth.payload)
  // we are using the audience to get the email and name from the token
  // if your audience is different you should change the key to match your audience
  // the value should match your audience according to this document: https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit#heading=h.fr3s9fjui5yn
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
  const nickname = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/nickname`];
  const picture = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/picture`];

  // console.log(nickname);
  // console.log(picture);
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    const user = await prisma.user.update({
      where: {
        auth0Id,
      },
      data: {
        nickname: nickname,
        image: picture,
      }
    })
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
        fileInd: true,
        image: true,
        imageInd: true,
        lastUpdateTime: true,
        desc: true,
      },
      orderBy: {
        lastUpdateTime: 'desc',
      },
    });

    const imgPath = `${process.env.REACT_APP_API_URL}/`

    for (var i = 0; i < contents.length; i++) {
      if (contents[i].imageInd === "Internal") {
        contents[i].image = imgPath + contents[i].image;
      } else if (contents[i].imageInd === "External") {

      }
    }

    // Send the fetched data as the response
    res.status(200).json(contents);
  } catch (error) {
    // Handle errors
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-content', async (req, res) => {
  try {
    const id = req.query.id;
    console.log(`${req}`);
    console.log(`ID received is ${id}`);
    if (id <= 0 || !(!isNaN(parseFloat(id)) && !isNaN(id - 0))) {
      throw TypeError("ID is not a valid number.")
    }
    // Fetch all Content entries from the database
    const contents = await prisma.content.findUnique({
      include: {
        author: true,
      },
      where: {
        id: parseInt(id),
      },
    });

    const imgPath = `${process.env.REACT_APP_API_URL}/`
    if (contents.imageInd === "Internal") {
      contents.image = imgPath + contents.image;
    }
    contents.author.auth0Id = null;
    console.log(`${contents}`)
    // Send the fetched data as the response
    res.status(200).json(contents);
  } catch (error) {
    if (error instanceof TypeError) {
      // TypeError action here
      console.error('Error fetching content:', error);
      res.status(400).json({ error: 'ID is not a valid number.' });
    } else {
      // Handle other errors
      console.error('Error fetching content:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
});

// Endpoint to fetch user's subscribed files. This endpoint requires authentication to be called.
app.get("/get-user-subscription", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    console.log(`${auth0Id}`);
    if (!(typeof auth0Id === 'string')) {
      throw TypeError("Auth0Id is not a valid string.")
    }
    const id = await getUserIdFromAuth0Id(auth0Id);
    console.log(`User id checked from auth0 is ${id}`);
    const subscribedContents = await prisma.userSubscription.findMany({
      include: {
        content: true,
      },
      where: {
        userId: parseInt(id),
      },
    });
    console.log(`Subscriptions of user id ${id} ar ${subscribedContents}`);

    // Send the fetched data as the response
    res.status(200).json(subscribedContents);

  } catch (e) {
    if (e instanceof TypeError) {
      // TypeError action here
      console.error('Error fetching content:', e);
      res.status(400).json({ error: 'Auth0Id is not a valid string.' });
    } else {
      // Handle other errors
      console.error('Error fetching content:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }

});

// Endpoint to fetch user's subscribed files. This endpoint requires authentication to be called.
app.get("/get-followed-user", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    console.log(`${auth0Id}`);
    if (!(typeof auth0Id === 'string')) {
      throw TypeError("Auth0Id is not a valid string.")
    }

    const userId = await getUserIdFromAuth0Id(auth0Id);
    console.log(`User id checked from auth0 is ${userId}`);
    if (userId <= 0 || !(!isNaN(parseFloat(userId)) && !isNaN(userId - 0))) {
      throw TypeError("User id is not a valid number.")
    }
    const followedUserId = await prisma.userFollowed.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    console.log(`Followed users of user ${userId} are ${followedUserId}`)
    // Send the fetched data as the response
    res.status(200).json(followedUserId);

  } catch (e) {
    if (e instanceof TypeError) {
      // TypeError action here
      console.error('Error fetching content:', e);
      res.status(400).json({ error: 'Auth0Id is not a valid string.' });
    } else {
      // Handle other errors
      console.error('Error fetching content:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }

});



// Endpoint to fetch user's subscribed files from their followed users. This endpoint requires authentication to be called.
app.get("/get-followed-contents", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    console.log(`${auth0Id}`);
    if (!(typeof auth0Id === 'string')) {
      throw TypeError("Auth0Id is not a valid string.")
    }

    const userId = await getUserIdFromAuth0Id(auth0Id);
    console.log(`User id checked from auth0 is ${userId}`);
    if (userId <= 0 || !(!isNaN(parseFloat(userId)) && !isNaN(userId - 0))) {
      throw TypeError("User id is not a valid number.")
    }
    const followedUserIdArray = await prisma.userFollowed.findMany({
      select: {
        followedUserId: true,
      },
      where: {
        userId: parseInt(userId),
      },
    });
    const followedUserId = followedUserIdArray.map(item => item.followedUserId);
    if (followedUserId == null || followedUserId == '' || followedUserId == []) {
      console.log(`User id ${userId} is following nobody.`);
      res.status(200).json([]);
    } else {
      console.log(`Followed users of user id ${userId} are: ${followedUserId}`);
      const followedUsersContents = await prisma.content.findMany({
        where: {
          authorId: {
            in: followedUserId
          },
        },
      });


      const imgPath = `${process.env.REACT_APP_API_URL}/`

      for (var i = 0; i < followedUsersContents.length; i++) {
        if (followedUsersContents[i].imageInd === "Internal") {
          followedUsersContents[i].image = imgPath + followedUsersContents[i].image;
        } else if (followedUsersContents[i].imageInd === "External") {

        }
      }

      // Send the fetched data as the response
      res.status(200).json(followedUsersContents);
    }

  } catch (e) {
    if (e instanceof TypeError) {
      // TypeError action here
      console.error('Error fetching content:', e);
      res.status(400).json({ error: 'Auth0Id is not a valid string.' });
    } else {
      // Handle other errors
      console.error('Error fetching content:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }

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

app.post('/subscibe-content', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  if (!(typeof auth0Id === 'string')) {
    throw TypeError("Auth0Id is not a valid string.")
  }

  const userId = await getUserIdFromAuth0Id(auth0Id);
  const { contentId } = req.body;
  if (!req.body.contentId) {
    res.status(400).send("ContentId is blank for adding new subscription.");
  }

  // Only subscribing actions from registered users are allowed.
  if (userId) {
    try {
      const newSubscription = await prisma.userSubscription.create({
        data: {
          userId: userId,
          contentId: parseInt(contentId)
        },
      });

      res.status(200).json(newSubscription);

    } catch (e) {
      res.status(200).json([]);
    }

  } else {
    // If the user is not registered, refuse the request to subscribe.
    res.status(403).send("Unauthorized subscribing action detected.")
  }
});

app.post('/follow-user', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  if (!(typeof auth0Id === 'string')) {
    throw TypeError("Auth0Id is not a valid string.")
  }
  const userId = await getUserIdFromAuth0Id(auth0Id);
  const { followUserId } = req.body;
  if (!req.body.followUserId) {
    res.status(400).send("FollowUserId is blank for adding new subscription.");
  }

  // Only subscribing actions from registered users are allowed.
  if (userId) {
    try {
      const newFollowing = await prisma.userFollowed.create({
        data: {
          userId: userId,
          followedUserId: parseInt(followUserId)
        },
      });

      res.status(200).json(newFollowing);

    } catch (e) {
      res.status(200).json([]);
    }

  } else {
    // If the user is not registered, refuse the request to subscribe.
    res.status(403).send("Unauthorized subscribing action detected.")
  }
});


app.delete('/unsubscibe-content', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  if (!(typeof auth0Id === 'string')) {
    throw TypeError("Auth0Id is not a valid string.")
  }

  const userId = await getUserIdFromAuth0Id(auth0Id);
  const { contentId } = req.body;
  if (!req.body.contentId) {
    res.status(400).send("ContentId is blank for adding new subscription.");
  }

  // Only unsubscribing actions from registered users are allowed.
  if (userId) {
    console.log(`User id ${parseInt(userId)} is going to unsubscribe ${parseInt(contentId)}.`)
    try {
      const delSubscription = await prisma.userSubscription.delete({
        where: {
          userId_contentId: { // This is how you refer to composite keys in Prisma
            userId: parseInt(userId),
            contentId: parseInt(contentId)
          }
        }
      });

      res.status(200).json(delSubscription);

    } catch (e) {
      res.status(400).send("Bad request. Please check input values")
      console.log(String(e))
    }

  } else {
    // If the user is not registered, refuse the request to subscribe.
    res.status(403).send("Unauthorized subscribing action detected.")
  }
});


app.delete('/unfollow-user', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  if (!(typeof auth0Id === 'string')) {
    throw TypeError("Auth0Id is not a valid string.")
  }
  const userId = await getUserIdFromAuth0Id(auth0Id);
  const { unfollowUserId } = req.body;
  if (!req.body.unfollowUserId) {
    res.status(400).send("FollowUserId is blank for adding new subscription.");
  }

  // Only subscribing actions from registered users are allowed.
  if (userId) {
    console.log(`User id ${userId} is going to unfollow ${unfollowUserId}.`)
    try {
      let delFollowing = await prisma.userFollowed.delete({
        where: {
          userId_followedUserId: {
            userId: parseInt(userId),
            followedUserId: parseInt(unfollowUserId)
          }
        },
      });
      // delFollowing = await delFollowing.json();
      res.status(200).json(delFollowing);
    } catch (e) {
      res.status(400).send("Bad request. Please check input values")
    }

  } else {
    // If the user is not registered, refuse the request to subscribe.
    res.status(403).send("Unauthorized subscribing action detected.")
  }
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
