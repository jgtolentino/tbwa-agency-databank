/**
 * Preview Server - Serves generated dashboards for validation and testing
 */

import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';

export async function startPreviewServer(dashboardDir: string, port: number = 3000): Promise<string> {
  const app = express();

  // Enable CORS for cross-origin requests
  app.use(cors());

  // Serve static files from the dashboard directory
  app.use(express.static(dashboardDir));

  // Check if this is a Next.js project
  const packageJsonPath = path.join(dashboardDir, 'package.json');
  let isNextJs = false;

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    isNextJs = packageJson.dependencies?.next || packageJson.devDependencies?.next;
  } catch (error) {
    // Package.json doesn't exist or is invalid
  }

  if (isNextJs) {
    // For Next.js projects, delegate to Next.js dev server
    return startNextJsServer(dashboardDir, port);
  }

  // For other frameworks, serve the built files
  app.get('*', async (req, res) => {
    try {
      // Try to serve index.html for SPA routing
      const indexPath = path.join(dashboardDir, 'index.html');
      const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);

      if (indexExists) {
        const html = await fs.readFile(indexPath, 'utf-8');
        res.send(html);
      } else {
        // Generate a basic HTML wrapper for the dashboard
        const html = await generatePreviewHTML(dashboardDir);
        res.send(html);
      }
    } catch (error) {
      res.status(500).send(`Preview error: ${error}`);
    }
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const url = `http://localhost:${port}`;
      resolve(url);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        // Try next port
        startPreviewServer(dashboardDir, port + 1).then(resolve).catch(reject);
      } else {
        reject(error);
      }
    });
  });
}

async function startNextJsServer(dashboardDir: string, port: number): Promise<string> {
  const { spawn } = await import('child_process');

  return new Promise((resolve, reject) => {
    const env = { ...process.env, PORT: port.toString() };

    const nextServer = spawn('npm', ['run', 'dev'], {
      cwd: dashboardDir,
      env,
      stdio: 'pipe'
    });

    let resolved = false;

    nextServer.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('ready') || output.includes(`http://localhost:${port}`)) {
        if (!resolved) {
          resolved = true;
          resolve(`http://localhost:${port}`);
        }
      }
    });

    nextServer.stderr?.on('data', (data) => {
      const output = data.toString();
      console.error('Next.js Error:', output);
    });

    nextServer.on('error', reject);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        reject(new Error('Next.js server start timeout'));
      }
    }, 30000);
  });
}

async function generatePreviewHTML(dashboardDir: string): Promise<string> {
  // Find the main dashboard component
  const srcDir = path.join(dashboardDir, 'src');
  let dashboardComponent = '';

  try {
    const files = await fs.readdir(srcDir);
    const dashboardFile = files.find(file =>
      file.toLowerCase().includes('dashboard') &&
      (file.endsWith('.tsx') || file.endsWith('.jsx'))
    );

    if (dashboardFile) {
      dashboardComponent = await fs.readFile(path.join(srcDir, dashboardFile), 'utf-8');
    }
  } catch (error) {
    // src directory might not exist
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .preview-container {
            padding: 24px;
            min-height: 100vh;
            background: #f8fafc;
        }
        .preview-header {
            background: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }
        .dashboard-frame {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            min-height: 600px;
            padding: 24px;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 400px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        function PreviewDashboard() {
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                setTimeout(() => setLoading(false), 1000);
            }, []);

            return (
                <div className="preview-container">
                    <div className="preview-header">
                        <h1 style={{margin: 0, color: '#1f2937'}}>Dashboard Preview</h1>
                        <p style={{margin: '8px 0 0 0', color: '#6b7280'}}>
                            Generated by DashMorph - Universal Dashboard Reconstruction
                        </p>
                    </div>

                    <div className="dashboard-frame">
                        {loading ? (
                            <div className="loading">
                                <div>Loading dashboard...</div>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{color: '#1f2937'}}>Generated Dashboard</h2>
                                <p style={{color: '#6b7280'}}>
                                    This is a preview of your generated dashboard.
                                    The actual dashboard components would be rendered here.
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '24px',
                                    marginTop: '24px'
                                }}>
                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h3 style={{margin: '0 0 16px 0', color: '#374151'}}>Sample Chart</h3>
                                        <div style={{
                                            height: '200px',
                                            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}>
                                            Chart Component
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h3 style={{margin: '0 0 16px 0', color: '#374151'}}>Sample KPI</h3>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{fontSize: '48px', fontWeight: 'bold', color: '#059669'}}>
                                                42.5K
                                            </div>
                                            <div style={{color: '#6b7280'}}>Total Revenue</div>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        gridColumn: 'span 2'
                                    }}>
                                        <h3 style={{margin: '0 0 16px 0', color: '#374151'}}>Sample Table</h3>
                                        <div style={{
                                            background: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #d1d5db',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr',
                                                background: '#f9fafb',
                                                padding: '12px',
                                                borderBottom: '1px solid #d1d5db',
                                                fontWeight: '600'
                                            }}>
                                                <div>Product</div>
                                                <div>Sales</div>
                                                <div>Growth</div>
                                            </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr',
                                                padding: '12px'
                                            }}>
                                                <div>Widget A</div>
                                                <div>$12,345</div>
                                                <div style={{color: '#059669'}}>+15%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        ReactDOM.render(<PreviewDashboard />, document.getElementById('root'));
    </script>
</body>
</html>`;
}