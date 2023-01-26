import axios from "axios";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import { calculateRawAPR, calculateDays } from "../utils/createLoanTermsSignatureWithItems";
const bigDecimal = require("js-big-decimal");

export const useLendingData = () => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const calcDemand = (allPrincipals) => {
    let total = BigNumber.from("0");
    allPrincipals.forEach((principal) => {
      total = total.add(BigNumber.from(principal.toString()));
    });
    return total.toString();
  };

  const calcLoaned = (allAccepted) => {
    let total = BigNumber.from("0");
    allAccepted.forEach((accepted) => {
      total = total.add(BigNumber.from(accepted.toString()));
    });
    return total.toString();
  };

  const calcTotalEarned = (principalRepaymentArray) => {
    let total = BigNumber.from("0");
    let difference = BigNumber.from("0");
    principalRepaymentArray.forEach((i) => {
      if (i.status === "REPAID") {
        difference = BigNumber.from(i.repayment.toString()).sub(BigNumber.from(i.principal.toString()));
        total = total.add(difference);
      }
      if (i.status === "DEFAULTED") {
        total = total.add(BigNumber.from(i.principal.toString()));
      }
    });
    return total.toString();
  };

  const calcAvgApr = (array) => {
    let total = "0";
    let avg = "0";
    array.forEach((i) => {
      let days = calculateDays(i.durationSecs);
      let apr = calculateRawAPR({ principal: i.principal, repayment: i.repayment, durationInDays: days });
      total = bigDecimal.add(total, apr.toString());
    });
    avg = bigDecimal.divide(total, String(array.length));
    return avg.toString();
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await axios.get("/api/allOffers");
      const demand = calcDemand(data?.data?.map((i) => i.principal.toString()));
      const loaned = calcLoaned(
        data?.data
          ?.filter((i) => i.status === "REPAID" || i.status === "ACCEPTED" || i.status === "DEFAULTED")
          ?.map((i) => i.principal.toString())
      );
      const totalEarned = calcTotalEarned(
        data?.data
          ?.filter((i) => i.status === "REPAID" || i.status === "DEFAULTED")
          ?.map((i) => ({
            principal: i.principal.toString(),
            repayment: i.repayment.toString(),
            status: i.status,
          }))
      );
      const averageAPR = calcAvgApr(
        data?.data?.map((i) => ({
          principal: i.principal.toString(),
          repayment: i.repayment.toString(),
          durationSecs: i.duration.toString(),
        }))
      );
      setData({
        demand: demand,
        loaned: loaned,
        totalEarned: totalEarned,
        averageAPR: averageAPR,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setIsLoading(false);
      setData([]);
    }
  };

  useEffect(() => {
    if (!data && !isLoading) {
      getData();
    }
  }, [data]);

  return { data, isLoading, isError, getData };
};
