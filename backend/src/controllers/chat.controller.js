import { response } from "express";
import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        const token = await generateStreamToken(req.auth().userId); //req.auth() is available due to clerk middleware

        res.status(200).json({ token }) ;
        
    } 

    catch (error) {
        console.error("Error in generating stream token :", error);
        res.status(500).json({ message : "Failed to generate Stream token" });
       
    }};