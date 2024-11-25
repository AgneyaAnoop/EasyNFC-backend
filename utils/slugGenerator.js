const User = require('../models/User');

exports.generateUniqueSlug = async (name) => {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  let slug = baseSlug;
  let counter = 1;

  while (await User.findOne({ 'profiles.urlSlug': slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};