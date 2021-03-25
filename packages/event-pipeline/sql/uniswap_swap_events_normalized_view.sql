-- Show Uniswap Swap Events in a format similar to other events

-- Uniswap Pair's Swap Event always includes in and out for both tokens. In the extracted data, there there is always only one token with amount greater than 0 as input or output. In this query I'll assume this is always true, but we need to confirm this
CREATE OR REPLACE VIEW events.uniswap_swap_events_normalized AS (
  SELECT
    observed_timestamp,
    uniswap_swap_events.contract_address,
    transaction_hash,
    transaction_index,
    log_index,
    block_hash,
    uniswap_swap_events.block_number,
    CASE
      WHEN amount0_in > 0 THEN
        token0_address
      ELSE
        token1_address
    END AS from_token,
    CASE
      WHEN amount0_out > 0 THEN
        token0_address
      ELSE
        token1_address
    END AS to_token,
    GREATEST(amount0_in, amount1_in) AS from_token_amount,
    GREATEST(amount0_out, amount1_out) AS to_token_amount
  FROM events.uniswap_swap_events
  JOIN events.uniswap_pairs ON uniswap_swap_events.contract_address = uniswap_pairs.contract_address
);
