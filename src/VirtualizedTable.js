import React from 'react';
import PropTypes from 'prop-types';
import {Table, Column, AutoSizer} from 'react-virtualized';

export default function VirtualizedTable(props) {
  const {
    data,
    children,
  } = props;
  const [displayData, setDisplayData] = React.useState([]);

  const rowGetter = React.useCallback(
    ({index}) => {
      return displayData[index];
    },
    [displayData],
  );

  const applySortAndFilter = React.useCallback(async () => {
    setDisplayData(data);
  }, [data]);

  React.useEffect(() => {
    applySortAndFilter();
  }, [applySortAndFilter]);

  return (
    <AutoSizer>
      {({width, height}) => (
        <Table
          width={width}
          height={height}
          headerHeight={40}
          rowHeight={40}
          rowGetter={rowGetter}
          rowCount={displayData.length}
        >
          {children}
        </Table>
      )}
    </AutoSizer>
  );
}

VirtualizedTable.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

VirtualizedTable.Column = Column;
