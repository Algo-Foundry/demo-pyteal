# Compiling PyTEAL files with or without Algo Builder
Compile PyTeal files using Algo Builder or Makefile. The PyTeal file is a stateless smart contract and we will be funding it.

If you compile PyTeal files using Algo Builder, a `escrow.py.yaml` file is created in the `artifacts/cache` folder. The TEAL code can be found within the yaml file.

If you choose to compile the PyTeal file using Makefile, the TEAL file `escrow.teal` file is created in the `artifacts` folder. You might need to create the `artifacts` folder if it doesn't exist. Windows users may have to settle for running the python command line directly to compile the PyTeal files to TEAL.

## Setup instructions

### Install packages
```
yarn install
```

### Update environement variables
1. Copy `.env.example` to `.env`.
2. Update Algorand Sandbox credentials in `.env` file.
3. Run `source .env` in the project directory

### Compile PyTeal files with Algo Builder
```
yarn run algob compile
```

### Run script to fund the escrow contract via Algo Builder
```
yarn run algob deploy scripts/2-escrow-account.js
```

### Compile PyTeal files using Makefile
```
make escrow
```

### Run script to fund the escrow contract without Algo Builder
```
node scripts/escrow-no-ab.js
```
