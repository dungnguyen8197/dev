# Base ReactJS App

#### Requirement

- Nodejs: v16.\*\*.\*\*

#### Running For DEV

- change config .env.development

```bash
npm install
```

```bash
npm start
```

#### Building Application

- change config .env

```bash
npm run build
```

#### Note

- Priority Env: **(from high to low, <environment_type> -> production || development || test)**
    * .env.<environment_type>.local
    * .env.<environment_type>
    * .env