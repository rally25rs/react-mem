import React from 'react';
import PropTypes from 'prop-types';
import {Table, Column, AutoSizer} from 'react-virtualized';

const HEADER_HEIGHT = 44;
const ROW_HEIGHT = 40;
const SORT_ASC = 'ASC';

export {Column};

function defaultSort(data, sortBy, sortDirection) {
  if (data && sortBy && sortDirection) {
    return data.sort((a, b) => {
      const v1 = a[sortBy];
      const v2 = b[sortBy];
      if ((v1 === undefined || v1 === null) && (v2 === undefined || v2 === null)) {
        return 0;
      }
      if (v1 === undefined || v1 === null || v1 < v2) {
        return sortDirection === SORT_ASC ? -1 : 1;
      } else if (v2 === undefined || v2 === null || v1 > v2) {
        return sortDirection === SORT_ASC ? 1 : -1;
      }
      return 0;
    });
  }
  return data;
}

export default function VirtualizedTable(props) {
  const {
    data,
    children,
    sortBy: defaultSortBy,
    sortDirection: defaultSortDirection,
    ...rest
  } = props;
  const [sortBy, setSortBy] = React.useState(defaultSortBy);
  const [sortDirection, setSortDirection] = React.useState(defaultSortDirection);
  const [displayData, setDisplayData] = React.useState([]);

  const rowGetter = React.useCallback(
    ({index}) => {
      return displayData[index];
    },
    [displayData],
  );

  const onSort = React.useCallback(
    options => {
      setSortBy(options.sortBy);
      setSortDirection(options.sortDirection);
    },
    [],
  );

  const applySortAndFilter = React.useCallback(async () => {
    const sortedData = defaultSort(data, sortBy, sortDirection);
    setDisplayData(sortedData);
  }, [sortBy, sortDirection, data]);

  React.useEffect(() => {
    applySortAndFilter();
  }, [applySortAndFilter]);

  return (
    <AutoSizer>
      {({width, height}) => (
        <Table
          width={width}
          height={height}
          headerHeight={HEADER_HEIGHT}
          rowHeight={ROW_HEIGHT}
          rowGetter={rowGetter}
          rowCount={displayData.length}
          sort={onSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          {...rest}
        >
          {children}
        </Table>
      )}
    </AutoSizer>
  );
}

VirtualizedTable.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
};

VirtualizedTable.Column = Column;
