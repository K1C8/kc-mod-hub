import express from "express";

const express = require('express')
const app = express();

MediaSourceHandle.exports = {
    getContents: async function () {
        let contents;
        try {
            // Fetch all Content entries from the database
            contents = await prisma.content.findMany({
                // select: {
                //   id: true,
                //   name: true,
                //   file: true,
                //   fileInd: true,
                //   image: true,
                //   imageInd: true,
                //   lastUpdateTime: true,
                //   desc: true,
                // },
                include: {
                    author: true
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
        } finally {
            if (contents != null) {
                return contents;
            } else {
                return "";
            }
        }
    }
}