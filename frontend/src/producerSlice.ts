import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Crop {
  crop_name: string;
  season: string;
}

interface Farm {
  id?: number;
  name: string;
  city: string;
  state: string;
  total_area: number;
  agri_area: number;
  veg_area: number;
  crops: Crop[];
}

interface Producer {
  id?: number;
  cpf_cnpj: string;
  name: string;
  farms: Farm[];
}

interface ProducerState {
  list: Producer[];
}

const initialState: ProducerState = {
  list: [],
};

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    setProducers: (state, action: PayloadAction<Producer[]>) => {
      state.list = action.payload;
    },
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.list.push(action.payload);
    },
    removeProducer: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setProducers, addProducer, removeProducer } = producerSlice.actions;
export default producerSlice.reducer;
