const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UsersDatabase = require('../../models/User');
const { sendArtworkSoldEmailToOwner, sendArtworkPurchaseEmailToBidder } = require('../../utils');

router.put("/id/confirm", async (req, res) => {
    const { artworkId, artworkName, bidAmount, bidderName, bidderId, timestamp } = req.body;

    try {
        // Step 1: Fetch all users
        const users = await UsersDatabase.find();

        // Step 2: Find the user who owns the artwork
        const owner = users.find(user =>
            user.artWorks.some(artwork => artwork._id.toString() === artworkId)
        );

        if (!owner) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: `Artwork not found: ${artworkId}`,
            });
        }

        // Step 3: Update the artwork status to "sold" (do NOT change creatorName here)
        const artwork = owner.artWorks.find(art => art._id.toString() === artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Artwork not found in owner's collection",
            });
        }

        // Step 4: Find the bidder and verify sufficient balance
        const bidder = await UsersDatabase.findOne({ _id: bidderId });

        if (!bidder) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Bidder not found",
            });
        }

        // Verify bidder has sufficient balance
        const bidderBalance = parseFloat(bidder.balance) || 0;
        if (bidderBalance < parseFloat(bidAmount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance to complete the purchase",
            });
        }

        // Update artwork status
        artwork.status = "sold";

        // Create a new copy of the artwork for the bidder
        const newArtwork = {
            ...(artwork.toObject ? artwork.toObject() : artwork),
            _id: new mongoose.Types.ObjectId(),
            status: "unlisted",
            owner: bidderName,
        };

        // Update financial records
        const updatedBidderBalance = (bidderBalance - parseFloat(bidAmount)).toString();
        const updatedOwnerProfit = (parseFloat(owner.profit || 0) + parseFloat(bidAmount)).toString();

        // Batch update all changes
        await Promise.all([
            // Update owner's artwork collection and profit
            UsersDatabase.updateOne(
                { _id: owner._id },
                { 
                    $set: { 
                        artWorks: owner.artWorks,
                        profit: updatedOwnerProfit
                    }
                }
            ),
            // Update bidder's artwork collection and balance
            UsersDatabase.updateOne(
                { _id: bidderId },
                { 
                    $push: { artWorks: newArtwork },
                    $set: { balance: updatedBidderBalance }
                }
            )
        ]);

        // Send email notifications
        await sendArtworkSoldEmailToOwner({
            to: owner.email,
            artworkName: artworkName,
            bidAmount: bidAmount,
            bidderName: bidderName,
            timestamp: timestamp
        });

        await sendArtworkPurchaseEmailToBidder({
            to: bidder.email,
            artworkName: artworkName,
            bidAmount: bidAmount,
            ownerName: owner.name,
            timestamp: timestamp
        });

        // Final response
        res.status(200).json({
            success: true,
            message: "Artwork successfully transferred and payment processed",
        });

    } catch (error) {
        console.error("Error during artwork transfer:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing the transaction",
        });
    }
});

module.exports = router;