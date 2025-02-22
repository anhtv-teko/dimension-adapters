import customBackfill from "../../helpers/customBackfill";
import { DEFAULT_TOTAL_VOLUME_FACTORY, DEFAULT_TOTAL_VOLUME_FIELD, DEFAULT_DAILY_VOLUME_FACTORY, DEFAULT_DAILY_VOLUME_FIELD } from "../../helpers/getUniSubgraphVolume";
import { CHAIN } from "../../helpers/chains";
import type { ChainEndpoints, SimpleAdapter } from "../../adapters/types";
import type { Chain } from "@defillama/sdk/build/general";
import { getGraphDimensions } from "../../helpers/getUniSubgraph";

// Subgraphs endpoints
const endpoints: ChainEndpoints = {
  [CHAIN.BASE]: "https://api.thegraph.com/subgraphs/name/harleen-m/baseswap",
};

// Fetch function to query the subgraphs
const graphs = getGraphDimensions({
  graphUrls: endpoints,
  totalVolume: {
    factory: DEFAULT_TOTAL_VOLUME_FACTORY,
    field: DEFAULT_TOTAL_VOLUME_FIELD,
  },
  dailyVolume: {
    factory: DEFAULT_DAILY_VOLUME_FACTORY,
    field: DEFAULT_DAILY_VOLUME_FIELD,
  },
  feesPercent: {
    type: "volume",
    UserFees: 0.25,
    SupplySideRevenue: 0.17,
    ProtocolRevenue: 0.08,
    Revenue: 0.25,
    Fees: 0.25,
  }
});

const methodology = {
  UserFees: "User pays 0.25% fees on each swap.",
  SupplySideRevenue: "LPs receive 0.17% of each swap.",
  ProtocolRevenue: "Treasury receives 0.08% of each swap.",
  Revenue: "All revenue generated comes from user fees.",
  Fees: "All fees comes from the user.",
};

const adapter: SimpleAdapter = {
  adapter: Object.keys(endpoints).reduce((acc, chain) => {
    return {
      ...acc,
      [chain]: {
        fetch: graphs(chain as Chain),
        start: async () => 1690495200,
        customBackfill: customBackfill(chain, graphs),
        meta: { methodology },
      }
    }
  }, {})
};

export default adapter;
