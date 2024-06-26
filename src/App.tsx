import React, { useReducer, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import Bit from "./Bit";
import "./bit.css";
import BitElement from "./BitElement";
import BitGroup from "./BitGroup";
import { cmcTooltips, omcTooltips } from "./bitTooltips";
import Footer from "./Footer";
import TooltipsList from "./TooltipsList";
import {} from "./utils";

const App = () => {
  const [, rerender] = useReducer((x) => x + 1, 0);
  const bits = useRef<BitGroup>(
    new BitGroup(Array.from({ length: 40 }, () => new Bit(0))),
  );
  const [binString, setBinString] = useState<string>(
    bits.current.toBinString(true),
  );
  const [hexString, setHexString] = useState<string>(
    bits.current.toHexString(),
  );

  const binInputRef = useRef<HTMLInputElement>(null);
  const hexInputRef = useRef<HTMLInputElement>(null);
  const tooltips = bits.current.getBit(0).asBool() ? cmcTooltips : omcTooltips;

  return (
    <>
      <div className="bit-container">
        {bits.current.getBits().map((bit, i) => (
          <React.Fragment key={"bit" + i}>
            <div style={{ display: "block" }}>
              <div
                style={{
                  color: "gray",
                  fontFamily: "monospace",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {40 - i - 1}
              </div>
              <BitElement
                bit={bit}
                data-tooltip-id={`bit-${40 - i - 1}-tooltip`}
                data-tooltip-content={`${tooltips[40 - i - 1].bit} ${
                  tooltips[40 - i - 1].mnemonic
                }: ${tooltips[40 - i - 1].comment}`}
                style={{
                  backgroundColor: bit.asBool() ? "#88ff88" : "white",
                }}
                onClick={() => {
                  bit.invert();
                  setBinString(bits.current.toBinString(true));
                  setHexString(bits.current.toHexString());
                }}
              />
            </div>
            {(40 - i - 1) % 4 === 0 ? (
              <div style={{ height: "auto", width: "0.75rem" }}></div>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </div>
      <hr style={{ margin: "50px 0" }} />
      <form
        style={{
          fontSize: 24,
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          rerender();
          binInputRef.current?.blur();
          hexInputRef.current?.blur();
        }}
      >
        <label>
          bin
          <input
            ref={binInputRef}
            style={{ fontFamily: "monospace", width: "35rem", fontSize: 18 }}
            value={binString}
            onChange={(e) => setBinString(e.target.value)}
            onBlur={(e) => {
              bits.current.setBinString(e.target.value);
              setBinString(bits.current.toBinString(true));
              setHexString(bits.current.toHexString());
              rerender();
            }}
          />
        </label>
        <label>
          hex
          <input
            ref={hexInputRef}
            style={{ fontFamily: "monospace", width: "10rem", fontSize: 18 }}
            value={hexString}
            onChange={(e) => setHexString(e.target.value)}
            onBlur={(e) => {
              bits.current.setHexString(e.target.value);
              setBinString(bits.current.toBinString(true));
              setHexString(bits.current.toHexString());
              rerender();
            }}
          />
        </label>
        <input type="submit" hidden />
      </form>
      <hr style={{ margin: "50px 0" }} />
      <TooltipsList
        tooltips={tooltips}
        bits={bits.current.getBitsDirect().map((b) => b.asBool())}
      />
      {tooltips.map((tooltip) => (
        <Tooltip
          id={`bit-${tooltip.bit}-tooltip`}
          key={`bit-${tooltip.bit}-tooltip`}
          style={{ fontFamily: "monospace" }}
        />
      ))}
      <Footer />
    </>
  );
};

export default App;
