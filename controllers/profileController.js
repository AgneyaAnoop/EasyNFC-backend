const User = require('../models/User');
const { generateUniqueSlug } = require('../utils/slugGenerator');

exports.createProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.profiles.length >= 5) {
      return res.status(400).json({ message: 'Maximum profile limit reached' });
    }

    const { name, phoneNo, about, links } = req.body;
    const urlSlug = await generateUniqueSlug(name);

    user.profiles.push({
      name,
      phoneNo,
      about,
      links,
      urlSlug
    });

    await user.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profileUrl: `${process.env.BASE_URL}/${urlSlug}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
};


exports.switchProfile = async (req, res) => {
  try {
    const { profileIndex } = req.body;
    const user = await User.findById(req.userId);

    if (profileIndex >= user.profiles.length) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    user.activeProfile = profileIndex;
    await user.save();

    res.json({
      message: 'Profile switched successfully',
      activeProfile: profileIndex,
      profileUrl: `${process.env.BASE_URL}/${user.profiles[profileIndex].urlSlug}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error switching profile', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { urlSlug } = req.params;
    const user = await User.findOne({ 'profiles.urlSlug': urlSlug });

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profile = user.profiles.find(p => p.urlSlug === urlSlug);
    
    res.json({
      name: profile.name,
      phoneNo: profile.phoneNo,
      about: profile.about,
      links: profile.links
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.getAllProfiles = async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        activeProfile: user.activeProfile,
        totalProfiles: user.profiles.length,
        profiles: user.profiles.map(profile => ({
          id: profile._id,
          name: profile.name,
          phoneNo: profile.phoneNo,
          about: profile.about,
          links: profile.links,
          urlSlug: profile.urlSlug,
          profileUrl: `${process.env.BASE_URL}/${profile.urlSlug}`
        }))
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
  };
  
  exports.getActiveProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const activeProfile = user.profiles[user.activeProfile];
      
      if (!activeProfile) {
        return res.status(404).json({ message: 'Active profile not found' });
      }
  
      res.json({
        id: activeProfile._id,
        name: activeProfile.name,
        phoneNo: activeProfile.phoneNo,
        about: activeProfile.about,
        links: activeProfile.links,
        urlSlug: activeProfile.urlSlug,
        profileUrl: `${process.env.BASE_URL}/${activeProfile.urlSlug}`
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active profile', error: error.message });
    }
  };
  
  exports.getProfileById = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      const { profileId } = req.params;
      
      const profile = user.profiles.id(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.json({
        id: profile._id,
        name: profile.name,
        phoneNo: profile.phoneNo,
        about: profile.about,
        links: profile.links,
        urlSlug: profile.urlSlug,
        profileUrl: `${process.env.BASE_URL}/${profile.urlSlug}`
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  };

  exports.getPublicProfiles = async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      let query = {};
      if (search) {
        query = {
          $or: [
            { 'profiles.name': { $regex: search, $options: 'i' } },
            { 'profiles.about': { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      const users = await User.find(query)
        .select('profiles')
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalProfiles = await User.countDocuments(query);
  
      const publicProfiles = users.reduce((acc, user) => {
        const profiles = user.profiles.map(profile => ({
          name: profile.name,
          about: profile.about,
          links: profile.links.filter(link => !link.isPrivate), // Add isPrivate field if needed
          urlSlug: profile.urlSlug,
          profileUrl: `${process.env.BASE_URL}/${profile.urlSlug}`
        }));
        return [...acc, ...profiles];
      }, []);
  
      res.json({
        profiles: publicProfiles,
        currentPage: page,
        totalPages: Math.ceil(totalProfiles / limit),
        totalProfiles
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching public profiles', error: error.message });
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      const { profileId } = req.params;
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the profile by ID
      const profileIndex = user.profiles.findIndex(
        profile => profile._id.toString() === profileId
      );
  
      if (profileIndex === -1) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      const { name, phoneNo, about, links } = req.body;
      
      // Generate new slug if name changed
      if (name && name !== user.profiles[profileIndex].name) {
        const urlSlug = await generateUniqueSlug(name);
        user.profiles[profileIndex].urlSlug = urlSlug;
      }
  
      // Update profile fields
      user.profiles[profileIndex] = {
        ...user.profiles[profileIndex].toObject(),
        name: name || user.profiles[profileIndex].name,
        phoneNo: phoneNo || user.profiles[profileIndex].phoneNo,
        about: about || user.profiles[profileIndex].about,
        links: links || user.profiles[profileIndex].links
      };
  
      await user.save();
  
      res.json({
        message: 'Profile updated successfully',
        profileUrl: `${process.env.BASE_URL}/${user.profiles[profileIndex].urlSlug}`
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };