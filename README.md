# nest-demo

参考 [nest-demo](https://161043261.github.io/t/nest)

## 压力测试

```bash
# MacOS
sudo apt install pipx
# Ubuntu
sudo apt install pipx
# Windows
scoop install pipx

pipx install poetry

source "$(poetry env info --path)/bin/activate"

# poetry init
# poetry add locust
poetry install

locust
```

## 运行本项目

```bash
# 运行后端项目
docker compose up mysql -d
pnpm install
pnpm start

# 运行前端项目
cd frontend
pnpm install
pnpm dev # pnpm build && pnpm preview
```
