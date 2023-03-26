export const bundlerUrl =
  "https://node.stackup.sh/v1/rpc/621d49f02369a7a589d86c6ea4d0fbf9c227013cde89853bef43552ee1c62be6";

export const backendUrl =
  process.env.NODE_ENV === "production" ? "https://fiat-paymaster.herokuapp.com" : "http://localhost:3001";
export const paypalClientId = "AeL2OJsqyf36-6jUnzOjr3otA_S6pI2Chk3cP0b_bcKzTjluDrvHBdxCcoIJ2G3zAyBXQVplQH9YqbSy";

export type Chain = "goerli" | "gnosis" | "optimism" | "polygonZKEVM" | "scrollAlpha";

export const config = {
  salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
  goerli: {
    explorer: "https://goerli.etherscan.io",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x09c58cf6be8E25560d479bd52B4417d15bCA2845",
    fiatPaymaster: "0x42e723f6Ae6b8CCF83395B09Ea88650381ae23dc",
    testCounter: "0x6F9641dd4b6Cf822D4cf52ceE753a8910b034827",
    connext: "0xFCa08024A6D4bCc87275b1E4A1E22B71fAD7f649",
    chainId: 5,
    connextDomainId: 1735353714,
  },
  scrollAlpha: {
    explorer: "https://blockscout.scroll.io/",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x09c58cf6be8E25560d479bd52B4417d15bCA2845",
    fiatPaymaster: "0xF22876F40B9b420c6BB5c4B314DEaEaaC74adf6f",
  },
  polygon: {
    explorer: "https://polygonscan.com",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x4130EF9f86854245D6A18B24868580B3C896f116",
    fiatPaymaster: "0x2b8a0dc9884af5436b09b9a8201bb1a987f05430",
    testCounter: "0x7482aF0Ab015a0da5f0573838202a9325f3199B2",
    connext: "0x11984dc4465481512eb5b777E44061C158CF2259",
    chainId: 137,
    connextDomainId: 1886350457,
  },
  polygonZKEVM: {
    explorer: "https://testnet-zkevm.polygonscan.com",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x4130EF9f86854245D6A18B24868580B3C896f116",
    fiatPaymaster: "0x4Ca0c9e4cD614a32B0f4C1d854005d1eF32A22bf",
    testCounter: "0x7482aF0Ab015a0da5f0573838202a9325f3199B2",
    chainId: 1442,
  },
  optimism: {
    explorer: "https://optimistic.etherscan.io",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x4130EF9f86854245D6A18B24868580B3C896f116",
    fiatPaymaster: "0xFAa11434746e882CA7A29ABD043AE357CAd5C878",
    testCounter: "0x7482aF0Ab015a0da5f0573838202a9325f3199B2",
    connext: "0x8f7492DE823025b4CfaAB1D34c58963F2af5DEDA",
    chainId: 10,
    connextDomainId: 1869640809,
  },
  optimismGoerli: {
    explorer: "https://goerli-optimism.etherscan.io",
    connext: "0x5Ea1bb242326044699C3d81341c5f535d5Af1504",
    chainId: 420,
    connextDomainId: 1735356532,
  },
  gnosis: {
    explorer: "https://gnosisscan.io",
    entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    simpleAccountFactory: "0x4130EF9f86854245D6A18B24868580B3C896f116",
    fiatPaymaster: "0x5d02C9B2a98d98E41FC53b92589a1099F5bF4CeE",
    testCounter: "0x7482aF0Ab015a0da5f0573838202a9325f3199B2",
    connext: "0x5bB83e95f63217CDa6aE3D181BA580Ef377D2109",
    chainId: 100,
    connextDomainId: 6778479,
  },
  mumbai: {
    explorer: "https://mumbai.polygonscan.com",
    connext: "0x2334937846Ab2A3FCE747b32587e1A1A2f6EEC5a",
    chainId: 80001,
    connextDomainId: 9991,
  },
};
