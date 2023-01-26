import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { formatAmount } from "./formatters";
import { ORIGINATION_CONTROLLER } from "../constants/addresses";
import { CHAIN } from "../constants/chain";

export const encodeSignatureItems = (items) => {
  const types = ["(uint256,address,int256,uint256)[]"];
  const values = items.map((item) => [item.cType, item.asset, item.tokenId, item.amount]);

  return ethers.utils.defaultAbiCoder.encode(types, [values]);
};

export const encodePredicates = (predicates) => {
  const types = ["(bytes,address)[]"];
  const values = predicates.map((p) => [p.data, p.verifier]);

  const coded = ethers.utils.defaultAbiCoder.encode(types, [values]);
  return ethers.utils.keccak256(coded);
};

export const calculateProtocolInterestRate = ({ principal, repayment }) => {
  const principalBn = new BigNumber(principal);
  const repaymentBn = new BigNumber(repayment);

  const formatted = repaymentBn.minus(principalBn).div(principalBn).times(100).toFixed();

  const protocolInterest = repaymentBn.minus(principalBn).div(principalBn).times(10000).toFixed();

  const interestInWei = ethers.utils.parseEther(protocolInterest);

  return { formatted, interestInWei };
};

export const calculateAPR = ({ principal, repayment, durationInDays }) => {
  // formulae APR = ((InterestAmt + Fees / Principal) / DurationInDays)) x 365 x 100
  const principalBn = new BigNumber(principal);
  const repaymentBn = new BigNumber(repayment);
  const durationInDaysBn = new BigNumber(durationInDays);

  const interestAmt = repaymentBn?.minus(principalBn);
  const initial = interestAmt.div(principalBn);
  const base = initial.div(durationInDaysBn);
  const apr = base.times(36500);
  return formatAmount(apr, 2) + "%";
};

export const calculateRawAPR = ({ principal, repayment, durationInDays }) => {
  // formulae APR = ((InterestAmt + Fees / Principal) / DurationInDays)) x 365 x 100
  const principalBn = new BigNumber(principal);
  const repaymentBn = new BigNumber(repayment);
  const durationInDaysBn = new BigNumber(durationInDays);

  const interestAmt = repaymentBn?.minus(principalBn);
  const initial = interestAmt.div(principalBn);
  const base = initial.div(durationInDaysBn);
  const apr = base.times(36500);
  return apr;
};

export const calculateDays = (seconds) => {
  if (!seconds) return 0;
  const days = parseInt(seconds) / 86400;
  return days;
};

export const calculateSeconds = (days) => {
  if (!days) return 0;
  const seconds = parseInt(days) * 86400;
  return seconds;
};

export const getDeadline = (durationInSeconds) => {
  const deadline = Math.round(Date.now() / 1000) + durationInSeconds;
  return deadline;
};

export const timeNowInSeconds = () => {
  return Math.round(Date.now() / 1000);
};

const buildData = (verifyingContract, name, version, message, typeData) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chainId = CHAIN;
  return {
    types: typeData,
    domain: {
      name,
      version,
      chainId,
      verifyingContract,
    },
    message,
  };
};

/**
 * Create an EIP712 signature for loan terms
 * @param verifyingContract The address of the contract that will be verifying this signature
 * @param name The name of the contract that will be verifying this signature
 * @param terms the LoanTerms object to sign
 * @param signer The EOA to create the signature
 * @param version The EIP712 version of the contract to use
 * @param nonce The signature nonce
 * @param side The side of the loan
 */
export async function createLoanItemsSignature(
  verifyingContract,
  name,
  terms,
  itemsHash,
  signer,
  version = "2",
  nonce,
  _side
) {
  const side = _side === "b" ? 0 : 1;

  const message = {
    durationSecs: terms.durationSecs,
    principal: terms.principal.toString(),
    interestRate: terms.interestRate.toString(),
    collateralAddress: terms.collateralAddress,
    itemsHash,
    payableCurrency: terms.payableCurrency,
    numInstallments: terms.numInstallments,
    nonce,
    side,
    deadline: terms.deadline,
  };

  const data = buildData(verifyingContract, name, version, message, typedLoanItemsData.types);

  // console.log("This is data:");
  // console.log(JSON.stringify(data, null, 4));
  const signature = await signer._signTypedData(data.domain, data.types, data.message);

  return signature;
}

const typedLoanItemsData = {
  types: {
    LoanTermsWithItems: [
      { name: "durationSecs", type: "uint32" },
      { name: "deadline", type: "uint32" },
      { name: "numInstallments", type: "uint24" },
      { name: "interestRate", type: "uint160" },
      { name: "principal", type: "uint256" },
      { name: "collateralAddress", type: "address" },
      { name: "itemsHash", type: "bytes32" },
      { name: "payableCurrency", type: "address" },
      { name: "nonce", type: "uint160" },
      { name: "side", type: "uint8" },
    ],
  },
  primaryType: "LoanTermsWithItems",
};

/**
 * Create an EIP712 signature for loan terms
 * @param verifyingContract The address of the contract that will be verifying this signature
 * @param name The name of the contract that will be verifying this signature
 * @param terms the LoanTerms object to sign
 * @param signer The EOA to create the signature
 * @param version The EIP712 version of the contract to use
 * @param nonce The signature nonce
 * @param side The side of the loan
 */
export async function createLoanTermsSignature(
  verifyingContract,
  name,
  terms,
  signer,
  version = "2",
  nonce,
  _side
) {
  const side = _side === "b" ? 0 : 1;
  const data = buildData(
    verifyingContract,
    name,
    version,
    { ...terms, nonce, side },
    typedLoanTermsData.types
  );
  console.log("This is data:");
  console.log(JSON.stringify(data, null, 4));
  const signature = await signer._signTypedData(data.domain, data.types, data.message);

  return signature;
}

const typedLoanTermsData = {
  types: {
    LoanTerms: [
      { name: "durationSecs", type: "uint32" },
      { name: "deadline", type: "uint32" },
      { name: "numInstallments", type: "uint24" },
      { name: "interestRate", type: "uint160" },
      { name: "principal", type: "uint256" },
      { name: "collateralAddress", type: "address" },
      { name: "collateralId", type: "uint256" },
      { name: "payableCurrency", type: "address" },
      { name: "nonce", type: "uint160" },
      { name: "side", type: "uint8" },
    ],
  },
  primaryType: "LoanTerms",
};
