# Routica

Routica is a powerful VS Code extension designed specifically for Node.js and Express developers. It provides an integrated development environment for testing and analyzing Express controller functions directly within your editor, making debugging and development more efficient.

## 🌟 Features

- **Express Controller Analysis**: Analyze your Express controller functions directly in VS Code
- **Integrated Testing**: Test your routes and controllers without leaving your editor
- **Real-time Feedback**: Get immediate feedback on your controller implementations
- **Debugging Support**: Enhanced debugging capabilities for Express applications

## 🚀 Getting Started

### Prerequisites

- Visual Studio Code (version 1.95.0 or higher)
- Node.js project with Express.js

### Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Routica"
4. Click Install

## 💻 Usage

### Basic Commands

- `Routica: Analyze Project` - Analyzes your Express project structure and controllers
- `Routica: Activate` - Activates the extension for the current workspace
- `Routica: Show Date` - Utility command to show current date and time

### How to Use

1. Open your Express.js project in VS Code
2. Use the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Routica" to see available commands
4. Select the desired command to execute

## 🛠️ Configuration

The extension can be configured through VS Code settings:

```json
{
  "routica.enable": true,
  "routica.analysisDepth": 3,
  "routica.showNotifications": true
}
```

## 🧪 Development

### Building from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/routica.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the extension:

   ```bash
   npm run compile
   ```

4. Run the extension:
   - Press F5 in VS Code to start debugging
   - Or use the "Run Extension" configuration

### Project Structure

```
routica/
├── src/
│   ├── utils/        # Utility functions
│   ├── constants/    # Constants and configurations
│   ├── test/         # Test files
│   └── extension.ts  # Main extension file
├── package.json
└── tsconfig.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- VS Code Extension API
- Express.js community
- All contributors and users of Routica

## 📫 Contact

For any questions or suggestions, please open an issue in the GitHub repository.

---

**Enjoy developing with Routica!** 🚀
