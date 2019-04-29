import React from 'react';
import PropTypes from 'prop-types';
import {Table, Column, AutoSizer} from 'react-virtualized';
// import SearchApi from 'js-worker-search';

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
    sort,
    sortBy: defaultSortBy,
    sortDirection: defaultSortDirection,
    filter,
    filterable,
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

  const filterIndex = React.useMemo(() => {
    return null;
  }, []);

  const applySortAndFilter = React.useCallback(async () => {
    if (filterIndex) {
      const filteredData = [];
      const indexes = await filterIndex.search(filter);
      indexes.forEach(i => filteredData.push(data[i]));

      const sortedData = (sort || defaultSort)(filteredData, sortBy, sortDirection);
      setDisplayData(sortedData);
    } else {
      setDisplayData(data);
    }
  }, [filterIndex, filter, sort, sortBy, sortDirection, data]);

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

VirtualizedTable.defaultProps = {
  filterable: false,
};

VirtualizedTable.propTypes = {
  /** The data to display */
  data: PropTypes.array.isRequired,
  /** Column nodes */
  children: PropTypes.node,
  /** A function to use to sort the data, use as an `array.sort` comparator (returns -1,0,1) */
  sort: PropTypes.func,
  /** The field name to sort by for the initial sort. Leaving this undefined will default to the natural order of the `data` array. */
  sortBy: PropTypes.string,
  /** The initial sort direction. 'ASC' or 'DESC'. */
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
  /** Optionally a string to filter entries by. */
  filter: PropTypes.string,
  /** Whether or not this table will be searchable. When enabled, all data will be rendered to strings and indexed to facilitate filtering. */
  filterable: PropTypes.bool,
};

VirtualizedTable.Column = Column;
