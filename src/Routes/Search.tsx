import { useLocation, useSearchParams } from "react-router-dom";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [searchParams] = useSearchParams();
  const word = searchParams.get("keyword");

  console.log(keyword, word);
  return <></>;
}
export default Search;
