import React from 'react';
import PropTypes from 'prop-types';

export default function VirtualizedTable(props) {

  const {
    data,
  } = props;
  const [displayData, setDisplayData] = React.useState([]);

  const rowGetter = React.useCallback(
    ({index}) => {
      return <div>{displayData[index]}</div>;
    },
    [displayData],
  );

  const applySortAndFilter = React.useCallback(async () => {
    // removed for simplicity; sorting and filtering of the data array would have been done here.
    setDisplayData(data);
  }, [data]);

  React.useEffect(() => {
    applySortAndFilter();
  }, [applySortAndFilter]);

  return (
    <>
      {() => (
        rowGetter(0)
      )()}
    </>
  );
}

VirtualizedTable.propTypes = {
  data: PropTypes.array.isRequired,
};
