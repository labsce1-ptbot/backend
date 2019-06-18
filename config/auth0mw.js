function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({message: "You need to be logged in"})
}

