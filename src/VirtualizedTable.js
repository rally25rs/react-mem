import React from 'react';
import PropTypes from 'prop-types';

export default function VirtualizedTable(props) {
  const { data } = props;
  const [displayData, setDisplayData] = React.useState([]);

  const rowGetter = React.useCallback(
    ({ index }) => {
      return displayData[index];
    },
    [displayData]
  );

  const applySortAndFilter = React.useCallback(
    async data => {
      // removed for simplicity; sorting and filtering of the data array would have been done here
      setDisplayData(data);
    },
    [setDisplayData]
  );

  React.useEffect(() => {
    applySortAndFilter(data);
  }, [applySortAndFilter, data]);

  return (
    // greatly simplified (you can look at git history to see what this was)
    // this was originally using a react-virtualized table.
    // https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
    // I eliminated the dependency and am using this `map()` instead.
    // Normally react-virtualized calls `rowGetter({index})` so that is why I am
    // calling rowGetter with an index instead of the actual array item.
    <>
      {displayData.map((row, index) => {
        const item = rowGetter({ index });
        return <div key={index}>{item.name}</div>;
      })}
    </>
  );
}

VirtualizedTable.propTypes = {
  data: PropTypes.array.isRequired
};
