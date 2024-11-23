import cloudinary from "../../services/cloudinary";

import { Response } from 'express';
import Post from '../../models/Post';
import Like from "../../models/Like";
import mongoose from 'mongoose';

export const getPosts = async (req: any, res: Response) => {
    try {
        const currentUserId = req.id;  // Current user ID from the request
        const userIdParam = req.query.author;  // Get the 'author' from the params (if provided)

        const pageLimit = parseInt(req.query.limit || '10');
        const pageNo = parseInt(req.query.page || '1');

        // Construct the pipeline
        const pipeline: any[] = [
            // Conditionally add the $match stage if author is provided
            ...(userIdParam ? [{ $match: { userId: new mongoose.Types.ObjectId(userIdParam) } }] : []),
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: '$author' },
            {
                $lookup: {
                    from: 'likes',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$postId', '$$postId'] },
                                        { $eq: ['$userId', currentUserId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userLike'
                }
            },
            {
                $addFields: {
                    authorName: '$author.name',
                    isLiked: { $gt: [{ $size: '$userLike' }, 0] }
                }
            },
            {
                $project: {
                    'author': 0,
                    'userLike': 0
                }
            },
            { $skip: (pageNo - 1) * pageLimit },
            { $limit: pageLimit }
        ];

        // Execute the aggregation pipeline
        const posts = await Post.aggregate(pipeline);

        // If 'author' is provided, filter posts by the specific user
        const totalPosts = userIdParam
            ? await Post.countDocuments({ userId: new mongoose.Types.ObjectId(userIdParam) })
            : await Post.countDocuments();  // Get all posts if no 'author' parameter is provided

        // Return the paginated posts
        res.status(200).json({
            data: posts,
            totalPosts,
            currentPage: pageNo,
            totalPages: Math.ceil(totalPosts / pageLimit),
            message: "Successfully Fetched Posts!"
        });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ message: 'Failed to retrieve posts', error: (error as Error).message });
    }
};


export const createPost = async (req: any, res: Response) => {
    try {
        const { title, bio, image } = req.body;
        const userId = req.id;

        // Check if image file exists
        let cloudinaryResponse : any;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image);
        }

        const newPost = new Post({
            title,
            bio,
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
            userId: userId,
            likes: 0
        });

        // Save post to database
        const createdPost = await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            data: createdPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            message: 'Failed to create post',
            error: (error as Error).message
        });
    }
};

export const toggleLike = async (req: any, res: Response) => {
    try {
        const currentUserId = req.id;
        const postId = req.params.postId;

        // Check if like already exists
        const existingLike = await Like.findOne({ 
            userId: currentUserId, 
            postId: postId 
        });

        if (existingLike) {
            // Unlike: Remove the like
            await Like.deleteOne({ 
                userId: currentUserId, 
                postId: postId 
            });
            
            await Post.findByIdAndUpdate(postId, { 
                $inc: { likes: -1 } 
            });

            return res.status(200).json({ 
                message: 'Post unliked', 
                liked: false 
            });
        } else {
            // Like: Create new like
            const newLike = new Like({ 
                userId: currentUserId, 
                postId: postId 
            });
            
            await newLike.save();
            
            await Post.findByIdAndUpdate(postId, { 
                $inc: { likes: 1 } 
            });

            return res.status(200).json({ 
                message: 'Post liked', 
                liked: true 
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ 
            message: 'Failed to toggle like', 
            error: (error as Error).message 
        });
    }
};
