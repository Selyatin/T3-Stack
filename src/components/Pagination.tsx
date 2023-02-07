import { FunctionComponent, useState } from "react"
import Router, {useRouter} from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  totalPages: number
}

const Pagination: FunctionComponent<Props> = ({totalPages}) => 
{
  if (totalPages < 1)
    return null;

  const router = useRouter();
  const page = parseInt(router.query.page as string) || 1;
  
  const changePage = (page: number) => {
    Router.push({
      pathname: router.pathname,
      query: {page}
    });
  }

  const selectPage = (e: {target: HTMLSelectElement}) => {
          const pageInt = parseInt(e.target.value);
          if (pageInt)
            changePage(pageInt);
  }

  const incrementPage = () => {
    if (page + 1 <= totalPages)
      changePage(page + 1);
  };

  const decrementPage = () => {
    if (page - 1 > 0)
      changePage(page - 1);
  }

  
return (<div className="flex flex-row w-full justify-end">
  <div className="flex flex-row gap-4">
      <button className="btn" onClick={decrementPage}
        ><FontAwesomeIcon icon={faAngleLeft} /></button
      >
    <div className="form-control">
      <select className="select select-bordered" value={page} onChange={selectPage}>
        {[...Array(totalPages).keys()].map((index) => <option key={index} value={index + 1}>{index + 1}</option>)}
      </select>
    </div>
      <button className="btn" onClick={incrementPage}
        ><FontAwesomeIcon icon={faAngleRight}/></button
      >
  </div>
</div>)
}

export default Pagination;