const reportSession = {};

export const setSession = (id, state) => {
  reportSession[id] = state;
};

export const getSession = id => reportSession[id];

export const deleteSession = id => delete reportSession[id];
