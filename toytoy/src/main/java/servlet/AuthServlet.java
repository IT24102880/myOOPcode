package servlet;

import service.AuthService;
import model.User;
import com.google.gson.Gson;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {
    private AuthService authService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        try {
            this.authService = new AuthService();
            this.gson = new Gson();
        } catch (SQLException e) {
            throw new ServletException("Failed to initialize AuthService", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");

        try {
            if ("login".equals(action)) {
                User user = authService.login(username, password);
                response.getWriter().write(gson.toJson(new Response(true, "Login successful", user)));
            } else if ("register".equals(action)) {
                User user = authService.register(username, email, password);
                response.getWriter().write(gson.toJson(new Response(true, "Registration successful", user)));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new Response(false, "Invalid action")));
            }
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new Response(false, e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new Response(false, "Database error")));
        }
    }

    private static class Response {
        boolean success;
        String message;
        User user;

        Response(boolean success, String message) {
            this(success, message, null);
        }

        Response(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }
    }
}
