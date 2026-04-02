## 👥 Team Tasks

Follow the branch and PR workflow.

---

### Branch Naming Rules

- `feature/<feature-name>` → New features
- `bugfix/<bug-name>` → Bug fixes

---

### Guidelines

- Pull latest `main` before creating a new branch:

```bash
git checkout main
git pull origin main

Create a branch for your task:

git checkout -b feature/your-feature

Commit regularly with clear messages:
git add .
git commit -m "Brief description of your work"

Push your branch and create a Pull Request when done:

git push origin feature/your-feature
```
