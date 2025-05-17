package service;

import dao.UserDAO;
import model.User;
import java.sql.SQLException;

public class AuthService {
    private UserDAO userDao;

    public AuthService() throws SQLException {
        this.userDao = new UserDAO();
    }

    public User register(String username, String email, String password) throws SQLException, IllegalArgumentException {
        // Check if username exists
        if (userDao.getUserByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Create new user
        boolean created = userDao.createUser(username, email, password);
        if (!created) {
            throw new SQLException("Failed to create user");
        }

        // Return the newly created user
        return userDao.getUserByUsername(username);
    }

    public User login(String username, String password) throws SQLException, IllegalArgumentException {
        // Verify credentials
        boolean isValid = userDao.verifyUser(username, password);
        if (!isValid) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Return user data
        return userDao.getUserByUsername(username);
    }
}