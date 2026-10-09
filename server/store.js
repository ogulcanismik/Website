import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const PROJECTS_PATH = 'content/projects.json';
const ROOT = process.cwd();

function useGithub() {
  return process.env.VERCEL === '1';
}

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'ogulcanismik';
  const repo = process.env.GITHUB_REPO || 'Website';
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token) {
    const error = new Error(
      'GITHUB_TOKEN is not set. Add it in the hosting environment so the live dashboard can save.'
    );
    error.status = 503;
    throw error;
  }
  return { token, owner, repo, branch };
}

async function github(pathname, options = {}) {
  const { token } = githubConfig();
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ogulcanismik-dashboard',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || 'GitHub request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function readGithubFile(filePath) {
  const { owner, repo, branch } = githubConfig();
  const data = await github(
    `/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`
  );
  return {
    text: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  };
}

async function writeGithubFile(filePath, body, message, sha) {
  const { owner, repo, branch } = githubConfig();
  await github(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(body).toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

export async function readProjects() {
  if (useGithub()) {
    const file = await readGithubFile(PROJECTS_PATH);
    return JSON.parse(file.text);
  }
  const text = await readFile(path.join(ROOT, PROJECTS_PATH), 'utf8');
  return JSON.parse(text);
}

export async function writeProjects(projects) {
  const body = `${JSON.stringify(projects, null, 2)}\n`;
  if (useGithub()) {
    const current = await readGithubFile(PROJECTS_PATH);
    await writeGithubFile(PROJECTS_PATH, body, 'Update projects from /oi', current.sha);
    return 'github';
  }
  await writeFile(path.join(ROOT, PROJECTS_PATH), body, 'utf8');
  return 'file';
}

export async function writeImage(name, buffer) {
  const publicPath = `public/images/${name}`;
  if (useGithub()) {
    let sha;
    try {
      const current = await readGithubFile(publicPath);
      sha = current.sha;
    } catch (error) {
      if (error.status !== 404 && !/not found/i.test(error.message)) throw error;
    }
    await writeGithubFile(publicPath, buffer, `Add project image ${name}`, sha);
    return 'github';
  }
  const dir = path.join(ROOT, 'public', 'images');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return 'file';
}
