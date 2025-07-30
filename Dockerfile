# ---------- 阶段 1：编译 ----------
FROM node:20 AS builder

WORKDIR /app

# 提前拷贝依赖描述文件并安装，充分利用缓存
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# 拷贝源码 & 编译
COPY . .

# 产出默认在 dist/ 目录
RUN npm run build        

# ---------- 阶段 2：运行 ----------
FROM nginx:stable-alpine AS runner

# 把编译后的静态文件放进 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# （可选）自定义 Nginx 配置
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查（按需）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# 启动
CMD ["nginx", "-g", "daemon off;"]