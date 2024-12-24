import Raffle from '../models/RaffleModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import cloudinary from 'cloudinary';
import { getPublicIdFromUrl } from '../utils/feauters.js';

export const createRaffle = asyncHandler(async (req, res) => {
    const { name, type, launchDate, drawDate, totalEntriesAllowed, ticketPrice } = req.body;
    const createdBy = req.user.id;
    const photo = req.file

    if (!photo) return next(new CustomError("Please add Photo", 400));

    if (!name || !type || !launchDate || !drawDate || !totalEntriesAllowed || !ticketPrice) {
        throw new CustomError('All fields are required.', 400);
    }

    if (new Date(launchDate) >= new Date(drawDate)) {
        throw new CustomError('Launch date must be before draw date.', 400);
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(photo.path, {
        folder: "lottery-photos",
    });


    const raffle = await Raffle.create({
        name,
        type,
        launchDate,
        drawDate,
        totalEntriesAllowed,
        ticketPrice,
        createdBy,
        photo: cloudinaryResponse.secure_url,
    });

    res.status(201).json({
        success: true,
        message: 'Raffle created successfully.',
        raffle,
    });
});

export const getAllRaffles = asyncHandler(async (req, res) => {
    const raffles = await Raffle.find().populate('createdBy', 'username role');
    res.status(200).json({
        success: true,
        raffles,
    });
});

export const getRaffleById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new CustomError('Raffle ID is required.', 400);
    }

    const raffle = await Raffle.findById(id).populate('createdBy', 'username role');
    if (!raffle) {
        throw new CustomError('Raffle not found.', 404);
    }

    res.status(200).json({
        success: true,
        raffle,
    });
});

export const updateRaffle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type, launchDate, drawDate, totalEntriesAllowed, ticketPrice, isApproved } = req.body;
    const photo = req.file;
    if (!id) {
        throw new CustomError('Raffle ID is required.', 400);
    }

    const raffle = await Raffle.findById(id);
    if (!raffle) {
        throw new CustomError('Raffle not found.', 404);
    }

    if (photo) {
        if (raffle.photo) {
            await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(raffle.photo));
        }
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(photo.path, {
            folder: "lottery-photos",
        });
        raffle.photo = cloudinaryResponse.secure_url;
    }

    if (name !== undefined) raffle.name = name;
    if (type !== undefined) {
        raffle.type = type;
    }
    if (launchDate !== undefined) raffle.launchDate = launchDate;
    if (drawDate !== undefined) raffle.drawDate = drawDate;
    if (totalEntriesAllowed !== undefined) raffle.totalEntriesAllowed = totalEntriesAllowed;
    if (ticketPrice !== undefined) raffle.ticketPrice = ticketPrice;
    if (isApproved !== undefined) raffle.isApproved = isApproved;

    raffle.updatedAt = new Date();
    await raffle.save();

    res.status(200).json({
        success: true,
        message: 'Raffle updated successfully.',
        raffle,
    });
});

export const deleteRaffle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new CustomError('Raffle ID is required.', 400);
    }
    const raffle = await Raffle.findById(id);
    if (!raffle) {
        throw new CustomError('Raffle not found.', 404);
    }
    if (raffle.photo) {
        await cloudinary.v2.uploader.destroy(getPublicIdFromUrl(raffle.photo));
    }

    await raffle.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Raffle deleted successfully.',
    });
});
