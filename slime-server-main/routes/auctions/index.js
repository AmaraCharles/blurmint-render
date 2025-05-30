const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const UsersDatabase = require('../../models/User');

// Create new auction
router.post('/:_id/create', async (req, res) => {
  const { _id } = req.params;
  const { nftId, startingPrice, duration } = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  try {
    const auction = {
      _id: uuidv4(),
      nftId,
      startingPrice,
      currentPrice: startingPrice,
      duration,
      status: 'active',
      bids: [],
      createdAt: new Date()
    };

    await user.updateOne({
      auctions: [...(user.auctions || []), auction]
    });

    res.status(201).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Place bid on auction
router.post('/:_id/bid', async (req, res) => {
  const { _id } = req.params;
  const { auctionId, amount } = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  try {
    const auction = user.auctions.find(a => a._id === auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be higher than current price'
      });
    }

    auction.bids.push({
      bidder: _id,
      amount,
      timestamp: new Date()
    });
    auction.currentPrice = amount;

    await user.updateOne({
      auctions: user.auctions.map(a => 
        a._id === auctionId ? auction : a
      )
    });

    res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get auction details
router.get('/:_id/:auctionId', async (req, res) => {
  const { _id, auctionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  try {
    const auction = user.auctions.find(a => a._id === auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;