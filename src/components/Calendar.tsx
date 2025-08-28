import type {InfinitePagerImperativeApi} from 'react-native-infinite-pager';

import dayjs from 'dayjs';
import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import InfinitePager from 'react-native-infinite-pager';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Colors from '@src/theme/Colors';
import {Svgs} from '@src/assets';
import Metrics from '@src/theme/Metrics';

type CalendarMode = 'month' | 'week';

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getDaysInMonth = (year: number, month: number): number => {
  // month is 0-based, so add 1 to get the actual month
  const monthsWith30Days = [3, 5, 8, 10];
  if (month === 1) return isLeapYear(year) ? 29 : 28;
  return monthsWith30Days.includes(month) ? 30 : 31;
};

const DEFAULT_DAYS_NAME = ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_MONTHS_NAME = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface CalendarProps {
  markedDates: any;
  monthName: string[];
  onNextMonth: (date: Date) => void;
  onPressDay: (date: Date) => void;
  onPrevMonth: (date: Date) => void;
  weekName: string[];
}
const CalendarExpandable: React.FC<CalendarProps> = ({
  markedDates,
  monthName,
  onNextMonth,
  onPressDay,
  onPrevMonth,
  weekName,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [initialDate, setInitialDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<CalendarMode>('week');
  const pagerRef = useRef<InfinitePagerImperativeApi>(null);
  const calendarHeight = useSharedValue(192);
  const [isAnimating, setIsAnimating] = useState(false);
  const getFirstDayOfMonth = useCallback(
    (year: number, month: number): number => {
      const day = new Date(year, month, 1).getDay();
      return day === 0 ? 6 : day - 1;
    },
    [],
  );

  const getTotalRowCalendar = useCallback(
    (dateString: Date) => {
      const year = dateString.getFullYear();
      const month = dateString.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);
      const totalCells = firstDayOfMonth + daysInMonth;
      const totalRows = Math.ceil(totalCells / 7);
      return totalRows;
    },
    [getFirstDayOfMonth],
  );

  const toggleMode = useCallback(() => {
    const totalRows = getTotalRowCalendar(currentDate);
    const toHeight = mode === 'week' ? 132 + totalRows * 62 : 192;
    setMode(mode === 'week' ? 'month' : 'week');
    setInitialDate(currentDate);
    setCurrentIndex(0);
    calendarHeight.value = withTiming(toHeight, {
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    });
  }, [calendarHeight, currentDate, getTotalRowCalendar, mode]);

  const navigateTime = useCallback(
    (direction: number) => {
      'worlet';
      runOnJS(setIsAnimating)(true);
      const newDate = new Date(currentDate);
      if (mode === 'week') {
        newDate.setDate(currentDate.getDate() + direction * 7);
      } else {
        newDate.setDate(2);
        newDate.setMonth(currentDate.getMonth() + direction);
      }
      setCurrentDate(newDate);
      const totalRows = getTotalRowCalendar(newDate);
      const toHeight = mode === 'week' ? 192 : 132 + totalRows * 62;
      calendarHeight.value = withTiming(
        toHeight,
        {
          duration: 300,
          easing: Easing.inOut(Easing.quad),
        },
        () => {
          runOnJS(setIsAnimating)(false);
        },
      );
      if (direction > 0) {
        onNextMonth(newDate);
      } else {
        onPrevMonth(newDate);
      }
    },
    [
      calendarHeight,
      currentDate,
      getTotalRowCalendar,
      mode,
      onNextMonth,
      onPrevMonth,
    ],
  );

  const renderDay = useCallback(
    (date: Date, day: string, isDifferentMonth?: boolean) => {
      const dateString = formatDateToString(date);
      const markedDate = markedDates ? markedDates[dateString] : undefined;
      const isMarked = markedDate?.marked;
      const dotColor = markedDate?.dotColor || Colors.orangeCarrot;
      const isCustom = markedDate?.type === 'custom';
      const customContainerStyle = markedDate?.customStyles?.container;
      const customTextStyle = markedDate?.customStyles?.text;

      return (
        <TouchableOpacity
          key={`day-${day}-${isDifferentMonth}-${date}`}
          onPress={() => {
            if (isDifferentMonth && mode === 'month') {
              if (dayjs(date).isBefore(currentDate)) {
                pagerRef.current?.decrementPage({animated: true});
              } else {
                pagerRef.current?.incrementPage({animated: true});
              }
            } else {
              setCurrentDate(date);
            }
            onPressDay(date);
          }}
          style={styles.monthDay}>
          <View style={[styles.day, isCustom && customContainerStyle]}>
            <Text
              style={[
                styles.dayText,
                isDifferentMonth && styles.differentMonthDayText,
                isCustom && customTextStyle,
              ]}>
              {day}
            </Text>
          </View>
          {isMarked && (
            <View style={styles.dotContainer}>
              <View style={[styles.dotStyle, {backgroundColor: dotColor}]} />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [currentDate, markedDates, mode, onPressDay],
  );

  const renderHeader = useCallback(() => {
    const monthNames = monthName ? monthName : DEFAULT_MONTHS_NAME;

    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => pagerRef.current?.decrementPage({animated: true})}
          style={styles.arrow}>
          <Svgs.ArrowLeft height={24} width={24} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthNames[currentDate.getMonth()]}
          {'\n'}
          <Text style={styles.yearText}>{currentDate.getFullYear()}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => pagerRef.current?.incrementPage({animated: true})}
          style={styles.arrow}>
          <Svgs.ArrowRight height={24} width={24} />
        </TouchableOpacity>
      </View>
    );
  }, [currentDate, monthName]);

  const renderWeekDays = useCallback(() => {
    const weekDays = weekName ? weekName : DEFAULT_DAYS_NAME;
    return (
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.weekDayText,
              index === 5 || index === 6
                ? {color: Colors.orangeCarrot}
                : {color: Colors.greyNightRider},
            ]}>
            {day}
          </Text>
        ))}
      </View>
    );
  }, [weekName]);

  const renderWeekView = useCallback(
    (dateString: Date) => {
      const startOfWeek = new Date(dateString);
      const currentDay = dateString.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      const currentMonth = dateString.getMonth();
      const currentYear = dateString.getFullYear();

      startOfWeek.setDate(dateString.getDate() + mondayOffset);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const isDifferentMonth =
          day.getMonth() !== currentMonth || day.getFullYear() !== currentYear;
        days.push(renderDay(day, day.getDate().toString(), isDifferentMonth));
      }

      return <View style={styles.weekContainer}>{days}</View>;
    },
    [renderDay],
  );

  const renderMonthView = useCallback(
    (dateString: Date) => {
      const year = dateString.getFullYear();
      const month = dateString.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);
      const days = [];
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
      // Days from previous month
      for (let i = 0; i < firstDayOfMonth; i++) {
        const day = daysInPrevMonth - firstDayOfMonth + i + 1;
        const date = new Date(prevYear, prevMonth, day);
        days.push(renderDay(date, day.toString(), true));
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push(renderDay(date, day.toString()));
      }

      // Days from next month
      const totalCells = firstDayOfMonth + daysInMonth;
      const remainingEmptyCells = 7 - (totalCells % 7);
      if (remainingEmptyCells < 7) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        for (let i = 1; i <= remainingEmptyCells; i++) {
          const date = new Date(nextYear, nextMonth, i);
          days.push(renderDay(date, i.toString(), true));
        }
      }

      return <View style={styles.monthContainer}>{days}</View>;
    },
    [getFirstDayOfMonth, renderDay],
  );

  const renderArrowBottom = useCallback(() => {
    return (
      <TouchableOpacity onPress={toggleMode} style={[styles.toggleButton]}>
        <View style={styles.arrowBottom} />
      </TouchableOpacity>
    );
  }, [toggleMode]);

  const calendarHeightStyle = useAnimatedStyle(() => {
    return {
      height: calendarHeight.value,
    };
  });

  const renderPage = useCallback(
    ({index}: {index: number}) => {
      const timeDate = dayjs(new Date(initialDate))
        .add(index, mode === 'week' ? 'week' : 'month')
        .toDate();
      return (
        <>
          {mode === 'week'
            ? renderWeekView(timeDate)
            : renderMonthView(timeDate)}
        </>
      );
    },
    [initialDate, mode, renderMonthView, renderWeekView],
  );

  const onPageChange = useCallback(
    (page: number) => {
      if (page === currentIndex) {
        return;
      } else {
        if (page > currentIndex) {
          navigateTime(1);
        } else {
          navigateTime(-1);
        }
        setCurrentIndex(page);
      }
    },
    [currentIndex, navigateTime],
  );

  return (
    <Animated.View style={[styles.container, calendarHeightStyle]}>
      <View style={styles.rootContainer}>
        {renderHeader()}
        {renderWeekDays()}
        <InfinitePager
          gesturesDisabled={isAnimating}
          key={`infinite-pager-${mode}`}
          onPageChange={onPageChange}
          pageBuffer={1}
          pageWrapperStyle={styles.flex}
          ref={pagerRef}
          renderPage={renderPage}
          style={styles.flex}
        />
        {renderArrowBottom()}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.12,
    shadowRadius: 2,
    width: '100%',
  },
  day: {
    alignItems: 'center',
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  dayText: {
    fontSize: 14,
  },
  differentMonthDayText: {
    color: Colors.greySuva,
    opacity: 0.5,
  },
  dotContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  dotStyle: {
    backgroundColor: Colors.orangeCarrot,
    borderRadius: 5,
    height: 5,
    width: 5,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  monthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: 16,
  },
  monthDay: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginBottom: 16,
    width: (Metrics.screen.width - 65) / 7,
  },

  monthText: {
    color: Colors.greyNightRider,
    fontSize: 18,
    textAlign: 'center',
  },
  navButton: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  rootContainer: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  selectedDay: {
    alignItems: 'center',
    backgroundColor: Colors.orangeCarrot,
    borderRadius: 10,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  selectedDayText: {
    color: Colors.white,
  },
  toggleButton: {
    alignItems: 'center',
    bottom: 8,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  weekDay: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginBottom: 16,
    width: 32,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  weekDayText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  yearText: {
    color: Colors.greySuva,
    fontSize: 14,
  },
  arrowBottom: {
    flex: 1,
    height: 6,
    width: 120,
    backgroundColor: Colors.greyNightRider,
    borderRadius: 6,
  },
});

export default CalendarExpandable;
