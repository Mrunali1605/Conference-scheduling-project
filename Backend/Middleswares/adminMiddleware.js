
const adminMiddleware = (req, res, next) => {
    try {
      // Check both user and userData for admin status
      const isAdmin = req.user?.isAdmin || req.userData?.isAdmin;
      
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin access required"
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Admin verification failed"
      });
    }
  };
  
  module.exports = adminMiddleware;