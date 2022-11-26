import { Option, Select } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { epmtyIssuesList, getIssues } from '../actions';

const Issues = () => {
  const selectedLabels = useSelector((state) => state.selectedLabelsStore);
  const reposlist = useSelector((state) => state.reposStore.reposlist);
  const { loading, issuesList, language } = useSelector((state) => state.issuesStore);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(epmtyIssuesList());
    if (reposlist) {
      for (let i = 0; i < reposlist.length; i++) {
        for (let j = 0; j < selectedLabels.length; j++) {
          if (language === 'All')
            dispatch(getIssues(reposlist[i].org, reposlist[i].repo, selectedLabels[j]));
          else if (language.toLowerCase() === reposlist[i].language.trim().toLowerCase())
            dispatch(getIssues(reposlist[i].org, reposlist[i].repo, selectedLabels[j]));
          else if (
            reposlist[i]?.topics?.trim().toLowerCase().split(' ').includes(language.toLowerCase())
          )
            dispatch(getIssues(reposlist[i].org, reposlist[i].repo, selectedLabels[j]));
        }
      }
    }
  }, [selectedLabels]);
  const issueListFlat = selectedLabels.length ? issuesList?.flat() : null;

  //Filter based on assignment status
  const filterOptions = ['All', 'Assigned', 'Unassigned'];
  const [filter, setFilter] = useState(filterOptions[0]);
  const [filteredList, setFilteredList] = useState([]);

  const updateFilter = (filter) => {
    setFilter(filter);
  };

  useEffect(() => {
    const filteredList = issueListFlat.filter((issue) => {
      if (filter == 'Assigned') return issue.assignees.length > 0;
      if (filter == 'Unassigned') return issue.assignees.length == 0;
      return true;
    });

    setFilteredList(filteredList);
  }, [filter]);

  return (
    <div className="issue-container h-100 d-flex flex-column">
      <div className="issue-header">
        <div className="filter-title text-center bg-dark">
          <h1 className="text-white h2">Issues</h1>
          <span>
            {selectedLabels.length
              ? filter == 'All'
                ? issueListFlat?.length
                : filteredList?.length
              : 0}{' '}
            available issues
          </span>
        </div>
      </div>
      <div className="flex mx-auto">
        <div className="pt-4">
          <Select
            variant="static"
            label="Filter"
            title="Filter"
            value={filter}
            onChange={updateFilter}>
            {filterOptions.map((option) => {
              return (
                <Option key={option} value={option}>
                  {option}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>

      {/* <div className="overflow-y-scroll"> */}
      {loading && (
        <div className="w-full text-center p-4">
          <div className="spinner-border text-center" role="status">
            <span className="sr-only ">Loading...</span>
          </div>
        </div>
      )}

      {!loading && !issuesList?.length && selectedLabels?.length ? (
        <div className="w-full text-center p-4">
          <span className="m-2 h2">No Issue Found</span>
        </div>
      ) : !selectedLabels.length ? (
        <div className="w-full text-center p-4">
          <span className="m-2 h2">No Label Selected</span>
        </div>
      ) : (
        <ul className="grid gap-2 p-2 xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {(filter == 'All' ? issueListFlat : filteredList).map((issue, i) => {
            return (
              <li key={i}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  className="no-underline card-link"
                  rel="noopener noreferrer">
                  <div className="py-2 transition-all card h-100 hover:bg-gray-100">
                    {issue.assignees.length > 0 ? (
                      <span className="absolute px-2 text-xs text-red-400 border border-red-400 rounded-lg py-py right-2 top-2">
                        Assigned
                      </span>
                    ) : (
                      <span className="absolute px-2 text-xs text-green-500 border border-green-500 rounded-lg py-py right-2 top-2">
                        Unassigned
                      </span>
                    )}

                    <div className="flex flex-col justify-center text-center card-body">
                      <span className="space-x-2 text-sm font-semibold text-pink-400 uppercase">
                        {issue.html_url.split('/').length > 4 ? issue.html_url.split('/')[4] : ''}
                      </span>
                      <h5 className="card-title">{issue?.title}</h5>
                      <div className="flex flex-wrap items-start justify-center text-xs">
                        {issue.labels.map((label, id) => (
                          <span key={id} className="px-2 mb-1 ml-1 border rounded-lg py-py">
                            {label.name}
                          </span>
                        ))}
                      </div>
                      <div className="absolute self-center mt-2 text-xs bottom-2">
                        Created at: {new Date(issue.created_at).toDateString().substr(4)}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
      {/* </div> */}
    </div>
  );
};

export default Issues;
