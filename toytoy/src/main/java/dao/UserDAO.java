package dao;

import model.User;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

public class UserDAO {
    private Connection connection;

    public UserDAO() throws SQLException {
        this.connection = DatabaseConnection.getInstance().getConnection();
    }

    // Create user with hashed password
    public boolean createUser(String username, String email, String password) throws SQLException {
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, username);
            statement.setString(2, email);
            statement.setString(3, hashedPassword);

            int affectedRows = statement.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Get user by username
    public User getUserByUsername(String username) throws SQLException {
        String sql = "SELECT * FROM users WHERE username = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            ResultSet rs = statement.executeQuery();

            if (rs.next()) {
                return new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("first_name"),
                        rs.getString("last_name"),
                        rs.getBoolean("is_premium")
                );
            }
            return null;
        }
    }

    // Verify user credentials
    public boolean verifyUser(String username, String password) throws SQLException {
        String sql = "SELECT password FROM users WHERE username = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            ResultSet rs = statement.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                return BCrypt.checkpw(password, storedHash);
            }
            return false;
        }
    }

    // Update user profile
    public boolean updateUserProfile(int userId, String email, String firstName, String lastName) throws SQLException {
        String sql = "UPDATE users SET email = ?, first_name = ?, last_name = ? WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);
            statement.setString(2, firstName);
            statement.setString(3, lastName);
            statement.setInt(4, userId);

            int affectedRows = statement.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Upgrade user to premium
    public boolean upgradeToPremium(int userId) throws SQLException {
        String sql = "UPDATE users SET is_premium = TRUE WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);

            int affectedRows = statement.executeUpdate();
            return affectedRows > 0;
        }
    }
}