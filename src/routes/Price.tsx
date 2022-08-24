import { useOutletContext } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div``;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 3%;
`;
const Item = styled.div`
  width: 48%;

  font-weight: 500;
  color: ${(props) => props.theme.textColor};
`;
const Tag = styled.h3`
  width: 50%;
`;

const Value = styled.h3<{ positive?: Boolean }>`
  color: ${(props) => (props.positive ? "#f53b57" : "#0fbcf9")};
`;

interface IData {
  data: {
    ath_date: string;
    ath_price: number;
    market_cap: number;
    market_cap_change_24h: number;
    percent_change_1h: number;
    percent_change_1y: number;
    percent_change_6h: number;
    percent_change_7d: number;
    percent_change_12h: number;
    percent_change_15m: number;
    percent_change_24h: number;
    percent_change_30d: number;
    percent_change_30m: number;
    percent_from_price_ath: number;
    price: number;
    volume_24h: number;
    volume_24h_change_24h: number;
  };
}

function Price() {
  const { data } = useOutletContext<IData>();
  console.log("data", data);
  const isPositive = (value: number | undefined) => {
    if (value) {
      return value > 0;
    }
  };
  return (
    <Container>
      <Overview>
        <Tag>Price :</Tag>
        <Item>
          <Value positive={isPositive(data?.percent_change_15m)}>
            $ {data?.price.toFixed(3)}
          </Value>
        </Item>
      </Overview>
      <Overview>
        <Tag>Max Change in last 24h:</Tag>
        <Item>
          <Value positive={isPositive(data?.market_cap_change_24h)}>
            {data.market_cap_change_24h} %
          </Value>
        </Item>
      </Overview>
      <Overview>
        <Tag>Change rate in last 30 Minutes:</Tag>
        <Item>
          <Value positive={isPositive(data?.percent_change_30m)}>
            {data.percent_change_30m} %
          </Value>
        </Item>
      </Overview>
      <Overview>
        <Tag>Change rate in last 1 hours:</Tag>
        <Item>
          <Value positive={isPositive(data?.percent_change_1h)}>
            {data.percent_change_1h} %
          </Value>
        </Item>
      </Overview>
      <Overview>
        <Tag>Change rate in last 12 hours:</Tag>
        <Item>
          <Value positive={isPositive(data?.percent_change_12h)}>
            {data.percent_change_12h} %
          </Value>
        </Item>
      </Overview>
      <Overview>
        <Tag>Change rate in last 24 hours:</Tag>
        <Item>
          <Value positive={isPositive(data?.percent_change_24h)}>
            {data.percent_change_24h} %
          </Value>
        </Item>
      </Overview>
    </Container>
  );
}

export default Price;
