export const ERC721_ABI = [
  "function ownerOf(uint256) public view returns(address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
];

export const ERC20_ABI = [
  "function allowance(address owner, address spender) public view returns(uint256)",
  "function approve(address spender, uint256) public returns(bool)",
  "function balanceOf(address) public view returns(uint256)",
  "function transfer(address recipient, uint256 amount) external returns(bool)",
];

export const VAULT_FACTORY_ABI = [
  "function instanceAt(uint256 tokenId) external view returns (address instance)",
  "function initializeBundle(address to) external returns (uint256)",
  "function isInstance(address instance) external view returns (bool validity)",
  "function instanceCount() external view returns (uint256 count)",
  "function getApproved(uint256 tokenId) public view returns(address)",
  "function approve(address spender, uint256 tokens) public",
  "function nonces(address) public view returns(uint256)",
  "event VaultCreated(address vault, address to)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed value)",
];

export const ASSET_VAULT_ABI = [
  "function owner() public view returns(address)",
  "function enableWithdraw() external",
  "function withdrawEnabled() public view returns(bool)",
  "function withdrawERC20(address token, address to) external",
  "function withdrawERC721(address token,uint256 tokenId, address to) external",
  "function call(address to, bytes calldata data) external",
  "function callApprove(address token, address spender, uint256 amount) external",
];

export const DEPOSIT_ROUTER_ABI = [
  "function depositERC721Batch( address vault, address[] calldata tokens, uint256[] calldata ids) external",
  "function depositERC721(address vault,address token, uint256 id) external",
  "function factory() public view returns(address)",
  "function reporter() public view returns(address)",
];

export const REPAYMENT_CONTROLLER_ABI = [
  "function repay(uint256 loanId) external",
  "function claim(uint256 loanId) external",
];

export const BORROW_NOTE_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed value)",
  "function ownerOf(uint256) public view returns(address)",
];

export const LENDER_NOTE_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed value)",
  "function ownerOf(uint256) public view returns(address)",
];

export const AUTO_COMPOUND_ABI = [
  "function allowance(address owner, address spender) public view returns(uint256)",
  "function approve(address spender, uint256) public returns(bool)",
  "function balanceOf(address) public view returns(uint256)",
  "function redeem(uint256 shares, address receiver, address owner) public returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) public returns (uint256)",
  "function deposit(uint256 assets, address receiver) public returns (uint256)",
  "function maxWithdraw(address owner) public view returns (uint256)", //balanceOf but w/ convertToAssests
  "function maxRedeem(address owner) public view returns (uint256)", //balanceOf
  "function totalAssets() external view returns (uint256 totalManagedAssets)",
];

export const LOAN_CORE_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "getLoan",
    outputs: [
      {
        components: [
          {
            internalType: "enum LoanLibrary.LoanState",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint24",
            name: "numInstallmentsPaid",
            type: "uint24",
          },
          { internalType: "uint160", name: "startDate", type: "uint160" },
          {
            components: [
              { internalType: "uint32", name: "durationSecs", type: "uint32" },
              { internalType: "uint32", name: "deadline", type: "uint32" },
              {
                internalType: "uint24",
                name: "numInstallments",
                type: "uint24",
              },
              {
                internalType: "uint160",
                name: "interestRate",
                type: "uint160",
              },
              { internalType: "uint256", name: "principal", type: "uint256" },
              {
                internalType: "address",
                name: "collateralAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "collateralId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "payableCurrency",
                type: "address",
              },
            ],
            internalType: "struct LoanLibrary.LoanTerms",
            name: "terms",
            type: "tuple",
          },
          { internalType: "uint256", name: "balance", type: "uint256" },
          { internalType: "uint256", name: "balancePaid", type: "uint256" },
          { internalType: "uint256", name: "lateFeesAccrued", type: "uint256" },
        ],
        internalType: "struct LoanLibrary.LoanData",
        name: "loanData",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const INVENTORY_REPORTER_ABI = [
  {
    inputs: [{ internalType: "address", name: "vault", type: "address" }],
    name: "enumerate",
    outputs: [
      {
        components: [
          {
            internalType: "enum IVaultInventoryReporter.ItemType",
            name: "itemType",
            type: "uint8",
          },
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "tokenAmount", type: "uint256" },
        ],
        internalType: "struct IVaultInventoryReporter.Item[]",
        name: "items",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const STAKING_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_apeCoinContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_baycContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_maycContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bakcContractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "ClaimRewards",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ClaimRewardsNft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTypePoolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bakcTokenId",
        type: "uint256",
      },
    ],
    name: "ClaimRewardsPairNft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "DepositNft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTypePoolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bakcTokenId",
        type: "uint256",
      },
    ],
    name: "DepositPairNft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastRewardedBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakedAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "accumulatedRewardsPerShare",
        type: "uint256",
      },
    ],
    name: "UpdatePool",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "WithdrawNft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTypePoolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bakcTokenId",
        type: "uint256",
      },
    ],
    name: "WithdrawPairNft",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_startTimestamp", type: "uint256" },
      { internalType: "uint256", name: "_endTimeStamp", type: "uint256" },
      { internalType: "uint256", name: "_capPerPosition", type: "uint256" },
    ],
    name: "addTimeRange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "addressPosition",
    outputs: [
      { internalType: "uint256", name: "stakedAmount", type: "uint256" },
      { internalType: "int256", name: "rewardsDebt", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "apeCoin",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "bakcToMain",
    outputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bool", name: "isPaired", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
    name: "claimApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNft[]",
        name: "_baycPairs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNft[]",
        name: "_maycPairs",
        type: "tuple[]",
      },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "claimBAKC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_nfts", type: "uint256[]" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "claimBAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_nfts", type: "uint256[]" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "claimMAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimSelfApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNft[]",
        name: "_baycPairs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNft[]",
        name: "_maycPairs",
        type: "tuple[]",
      },
    ],
    name: "claimSelfBAKC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256[]", name: "_nfts", type: "uint256[]" }],
    name: "claimSelfBAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256[]", name: "_nfts", type: "uint256[]" }],
    name: "claimSelfMAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "depositApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNftWithAmount[]",
        name: "_baycPairs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNftWithAmount[]",
        name: "_maycPairs",
        type: "tuple[]",
      },
    ],
    name: "depositBAKC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
    ],
    name: "depositBAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
    ],
    name: "depositMAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "depositSelfApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getAllStakes",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getApeCoinStake",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getBakcStakes",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getBaycStakes",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getMaycStakes",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolsUI",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "stakedAmount", type: "uint256" },
          {
            components: [
              {
                internalType: "uint256",
                name: "startTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "rewardsPerHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "capPerPosition",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.TimeRange",
            name: "currentTimeRange",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.PoolUI",
        name: "",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "stakedAmount", type: "uint256" },
          {
            components: [
              {
                internalType: "uint256",
                name: "startTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "rewardsPerHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "capPerPosition",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.TimeRange",
            name: "currentTimeRange",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.PoolUI",
        name: "",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "stakedAmount", type: "uint256" },
          {
            components: [
              {
                internalType: "uint256",
                name: "startTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "rewardsPerHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "capPerPosition",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.TimeRange",
            name: "currentTimeRange",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.PoolUI",
        name: "",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "stakedAmount", type: "uint256" },
          {
            components: [
              {
                internalType: "uint256",
                name: "startTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endTimestampHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "rewardsPerHour",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "capPerPosition",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.TimeRange",
            name: "currentTimeRange",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.PoolUI",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "getSplitStakes",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "deposited", type: "uint256" },
          { internalType: "uint256", name: "unclaimed", type: "uint256" },
          { internalType: "uint256", name: "rewards24hr", type: "uint256" },
          {
            components: [
              { internalType: "uint256", name: "mainTokenId", type: "uint256" },
              {
                internalType: "uint256",
                name: "mainTypePoolId",
                type: "uint256",
              },
            ],
            internalType: "struct ApeCoinStaking.DashboardPair",
            name: "pair",
            type: "tuple",
          },
        ],
        internalType: "struct ApeCoinStaking.DashboardStake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "getTimeRangeBy",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestampHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTimestampHour",
            type: "uint256",
          },
          { internalType: "uint256", name: "rewardsPerHour", type: "uint256" },
          { internalType: "uint256", name: "capPerPosition", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.TimeRange",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "mainToBakc",
    outputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bool", name: "isPaired", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nftContracts",
    outputs: [{ internalType: "contract ERC721Enumerable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "nftPosition",
    outputs: [
      { internalType: "uint256", name: "stakedAmount", type: "uint256" },
      { internalType: "int256", name: "rewardsDebt", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "pendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "pools",
    outputs: [
      {
        internalType: "uint256",
        name: "lastRewardedTimestampHour",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastRewardsRangeIndex",
        type: "uint256",
      },
      { internalType: "uint256", name: "stakedAmount", type: "uint256" },
      {
        internalType: "uint256",
        name: "accumulatedRewardsPerShare",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "removeLastTimeRange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "_from", type: "uint256" },
      { internalType: "uint256", name: "_to", type: "uint256" },
    ],
    name: "rewardsBy",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_addr", type: "address" }],
    name: "stakedTotal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "withdrawApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNftWithAmount[]",
        name: "_baycPairs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "uint256", name: "mainTokenId", type: "uint256" },
          { internalType: "uint256", name: "bakcTokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.PairNftWithAmount[]",
        name: "_maycPairs",
        type: "tuple[]",
      },
    ],
    name: "withdrawBAKC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "withdrawBAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "withdrawMAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "withdrawSelfApeCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
    ],
    name: "withdrawSelfBAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        internalType: "struct ApeCoinStaking.SingleNft[]",
        name: "_nfts",
        type: "tuple[]",
      },
    ],
    name: "withdrawSelfMAYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const ORIGINATION_CONTROLLER_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "uint256", name: "interestRate", type: "uint256" }],
    name: "FIAC_InterestRate",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "caller", type: "address" }],
    name: "OC_ApprovedOwnLoan",
    type: "error",
  },
  { inputs: [], name: "OC_BatchLengthMismatch", type: "error" },
  {
    inputs: [{ internalType: "address", name: "caller", type: "address" }],
    name: "OC_CallerNotParticipant",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "interestRate", type: "uint256" }],
    name: "OC_InterestRate",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "address", name: "signer", type: "address" },
    ],
    name: "OC_InvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum LoanLibrary.LoanState",
        name: "state",
        type: "uint8",
      },
    ],
    name: "OC_InvalidState",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "verifier", type: "address" }],
    name: "OC_InvalidVerifier",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "durationSecs", type: "uint256" }],
    name: "OC_LoanDuration",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "numInstallments", type: "uint256" }],
    name: "OC_NumberInstallments",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "verifier", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "address", name: "vault", type: "address" },
    ],
    name: "OC_PredicateFailed",
    type: "error",
  },
  { inputs: [], name: "OC_PredicatesArrayEmpty", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "principal", type: "uint256" }],
    name: "OC_PrincipalTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oldCollateralAddress",
        type: "address",
      },
      { internalType: "uint256", name: "oldCollateralId", type: "uint256" },
      {
        internalType: "address",
        name: "newCollateralAddress",
        type: "address",
      },
      { internalType: "uint256", name: "newCollateralId", type: "uint256" },
    ],
    name: "OC_RolloverCollateralMismatch",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "oldCurrency", type: "address" },
      { internalType: "address", name: "newCurrency", type: "address" },
    ],
    name: "OC_RolloverCurrencyMismatch",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "caller", type: "address" }],
    name: "OC_SelfApprove",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
    name: "OC_SignatureIsExpired",
    type: "error",
  },
  { inputs: [], name: "OC_ZeroAddress", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAllowed",
        type: "bool",
      },
    ],
    name: "SetAllowedVerifier",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BASIS_POINTS_DENOMINATOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INSTALLMENT_PERIOD_MULTIPLIER",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INTEREST_RATE_DENOMINATOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LATE_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "allowedVerifiers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "principal", type: "uint256" },
      { internalType: "uint256", name: "interestRate", type: "uint256" },
    ],
    name: "getFullInterestAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getRoleMember",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleMemberCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_loanCore", type: "address" }],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
    ],
    name: "initializeLoan",
    outputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "collateralSig",
        type: "tuple",
      },
      { internalType: "uint256", name: "permitDeadline", type: "uint256" },
    ],
    name: "initializeLoanWithCollateralPermit",
    outputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "collateralSig",
        type: "tuple",
      },
      { internalType: "uint256", name: "permitDeadline", type: "uint256" },
      {
        components: [
          { internalType: "bytes", name: "data", type: "bytes" },
          { internalType: "address", name: "verifier", type: "address" },
        ],
        internalType: "struct LoanLibrary.Predicate[]",
        name: "itemPredicates",
        type: "tuple[]",
      },
    ],
    name: "initializeLoanWithCollateralPermitAndItems",
    outputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        components: [
          { internalType: "bytes", name: "data", type: "bytes" },
          { internalType: "address", name: "verifier", type: "address" },
        ],
        internalType: "struct LoanLibrary.Predicate[]",
        name: "itemPredicates",
        type: "tuple[]",
      },
    ],
    name: "initializeLoanWithItems",
    outputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "verifier", type: "address" }],
    name: "isAllowedVerifier",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "signer", type: "address" },
    ],
    name: "isApproved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "bytes32", name: "sighash", type: "bytes32" },
    ],
    name: "isApprovedForContract",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "address", name: "signer", type: "address" },
    ],
    name: "isSelfOrApproved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanCore",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        internalType: "enum IOriginationController.Side",
        name: "side",
        type: "uint8",
      },
      { internalType: "bytes32", name: "itemsHash", type: "bytes32" },
    ],
    name: "recoverItemsSignature",
    outputs: [
      { internalType: "bytes32", name: "sighash", type: "bytes32" },
      { internalType: "address", name: "signer", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        internalType: "enum IOriginationController.Side",
        name: "side",
        type: "uint8",
      },
    ],
    name: "recoverTokenSignature",
    outputs: [
      { internalType: "bytes32", name: "sighash", type: "bytes32" },
      { internalType: "address", name: "signer", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "oldLoanId", type: "uint256" },
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
    ],
    name: "rolloverLoan",
    outputs: [{ internalType: "uint256", name: "newLoanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "oldLoanId", type: "uint256" },
      {
        components: [
          { internalType: "uint32", name: "durationSecs", type: "uint32" },
          { internalType: "uint32", name: "deadline", type: "uint32" },
          { internalType: "uint24", name: "numInstallments", type: "uint24" },
          { internalType: "uint160", name: "interestRate", type: "uint160" },
          { internalType: "uint256", name: "principal", type: "uint256" },
          {
            internalType: "address",
            name: "collateralAddress",
            type: "address",
          },
          { internalType: "uint256", name: "collateralId", type: "uint256" },
          {
            internalType: "address",
            name: "payableCurrency",
            type: "address",
          },
        ],
        internalType: "struct LoanLibrary.LoanTerms",
        name: "loanTerms",
        type: "tuple",
      },
      { internalType: "address", name: "lender", type: "address" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        internalType: "struct IOriginationController.Signature",
        name: "sig",
        type: "tuple",
      },
      { internalType: "uint160", name: "nonce", type: "uint160" },
      {
        components: [
          { internalType: "bytes", name: "data", type: "bytes" },
          { internalType: "address", name: "verifier", type: "address" },
        ],
        internalType: "struct LoanLibrary.Predicate[]",
        name: "itemPredicates",
        type: "tuple[]",
      },
    ],
    name: "rolloverLoanWithItems",
    outputs: [{ internalType: "uint256", name: "newLoanId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "verifier", type: "address" },
      { internalType: "bool", name: "isAllowed", type: "bool" },
    ],
    name: "setAllowedVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "verifiers", type: "address[]" },
      { internalType: "bool[]", name: "isAllowed", type: "bool[]" },
    ],
    name: "setAllowedVerifierBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newImplementation", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
