package service;

import dao.UserDAO;
import java.sql.SQLException;

public class UserService {
    private UserDAO userDao;

    public UserService() throws SQLException {
        this.userDao = new UserDAO();
    }

    public boolean updateProfile(int userId, String email, String firstName, String lastName) throws SQLException {
        return userDao.updateUserProfile(userId, email, firstName, lastName);
    }

    public boolean upgradeToPremium(int userId) throws SQLException {
        return userDao.upgradeToPremium(userId);
    }
}