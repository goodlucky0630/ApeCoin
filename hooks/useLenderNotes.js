import { BigNumber, constants, ethers } from "ethers";
import { useMemo, useEffect, useState, useRef } from "react";
import { useProvider } from "wagmi";
import { LENDER_NOTE, LOAN_CORE } from "../constants/addresses";
import { LOAN_CORE_ABI, LENDER_NOTE_ABI } from "../constants/abi";
import { Multicall } from "ethereum-multicall";

export const useLenderNotes = () => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const provider = useProvider();
  const lenderNoteInstance = useMemo(
    () => new ethers.Contract(LENDER_NOTE, LENDER_NOTE_ABI, provider),
    [provider]
  );
  const callingRef = useRef(false);

  const getLenderNotes = async () => {
    try {
      callingRef.current = true;
      setIsLoading(true);
      setIsError(false);

      const noteTransfered = lenderNoteInstance.filters.Transfer(
        null,
        null,
        null
      );

      const events = await lenderNoteInstance.queryFilter(noteTransfered);
      // console.log(events);

      if (events.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      let allMinted = [];

      for (let i = 0; i < events.length; i++) {
        if (events[i].args.to !== constants.AddressZero) {
          allMinted.push(events[i].args);
        }
      }

      const calls = allMinted.map((i, idx) => ({
        reference: `ownerOf${idx}`,
        methodName: "ownerOf(uint256)",
        methodParameters: [i.value],
      }));

      const multicall = new Multicall({
        ethersProvider: provider,
        tryAggregate: true,
      });

      const contractCallContext = {
        reference: "PromissoryNote",
        contractAddress: LENDER_NOTE,
        abi: LENDER_NOTE_ABI,
        calls: [...calls],
      };

      const results = await multicall.call(contractCallContext);

      let allNotes = [];

      for (let i = 0; i < allMinted.length; i++) {
        if (
          results.results.PromissoryNote.callsReturnContext[i].returnValues
            .length !== 0
        ) {
          allNotes.push({
            ownerOfLenderNote: allMinted[i].to.toLowerCase(),
            loanId: allMinted[i].value.toString(),
          });
        }
      }

      const calls1 = allNotes.map((i, idx) => ({
        reference: `getLoan${idx}`,
        methodName: "getLoan(uint256)",
        methodParameters: [i.loanId],
      }));

      const contractCallContext1 = {
        reference: "LoanCore",
        contractAddress: LOAN_CORE,
        abi: LOAN_CORE_ABI,
        calls: [...calls1],
      };

      const results1 = await multicall.call(contractCallContext1);

      const LoanState = ["DUMMY", "ACTIVE", "REPAID", "DEFAULTED"];

      for (let i = 0; i < allNotes.length; i++) {
        allNotes[i].loanState =
          LoanState[
            results1.results.LoanCore.callsReturnContext[i].returnValues[0]
          ];
        allNotes[i].numInstallmentsPaid =
          results1.results.LoanCore.callsReturnContext[i].returnValues[1];
        allNotes[i].startDate = Number(
          results1.results.LoanCore.callsReturnContext[i].returnValues[2].hex
        );
        allNotes[i].durationSecs =
          results1.results.LoanCore.callsReturnContext[i].returnValues[3][0];
        allNotes[i].deadline =
          results1.results.LoanCore.callsReturnContext[i].returnValues[3][1];
        allNotes[i].numInstallments =
          results1.results.LoanCore.callsReturnContext[i].returnValues[3][2];
        allNotes[i].interestRate = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[3][3].hex.toString()
        ).toString();
        allNotes[i].principal = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[3][4].hex.toString()
        ).toString();
        allNotes[i].collateralAddress =
          results1.results.LoanCore.callsReturnContext[i].returnValues[3][5];
        allNotes[i].vaultTokenId = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[3][6].hex.toString()
        ).toString();
        allNotes[i].payableCurrency =
          results1.results.LoanCore.callsReturnContext[i].returnValues[3][7];
        allNotes[i].balance = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[4].hex.toString()
        ).toString();
        allNotes[i].balancePaid = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[5].hex.toString()
        ).toString();
        allNotes[i].lateFeesAccrued = BigNumber.from(
          results1.results.LoanCore.callsReturnContext[
            i
          ].returnValues[6].hex.toString()
        ).toString();
      }

      setData(allNotes);
      setIsLoading(false);
      callingRef.current = false;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data && !callingRef.current) {
      getLenderNotes();
    }
  }, [data]);

  return { data, isLoading, isError, getLenderNotes };
};
