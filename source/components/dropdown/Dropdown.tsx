import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { DropdownOption } from '../../types/Dropdown';

interface Props {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onSelectOption: (option: DropdownOption) => void;
  label: string;
}

const Dropdown: FC<Props> = ({
  options,
  selectedOption,
  onSelectOption,
  label,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [areOptionsShown, setAreOptionsShown] = useState<boolean>(false);
  const selectedOptionRef = useRef<Text | null>(null);
  const optionsRef = useRef<View | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (areOptionsShown) {
      optionsRef.current?.measure(
        (_x, _y, optionsWidth, _height, _pageX, _pageY) => {
          selectedOptionRef.current?.measure(
            (_x, _y, width, height, pageX, pageY) => {
              let x = pageX - optionsWidth / 2 + width / 2;

              if (x < 20) {
                x = 20;
              } else if (x + optionsWidth > windowWidth - 20) {
                x = x - (x + optionsWidth - (windowWidth - 20));
              }

              setDropdownPosition({
                x: x,
                y: pageY + height,
              });
            },
          );
        },
      );
    }
  }, [selectedOptionRef, optionsRef, areOptionsShown, windowWidth]);

  const showOptions = useCallback(() => {
    setAreOptionsShown(true);
  }, []);

  const hideOptions = useCallback(() => {
    setAreOptionsShown(false);
  }, []);

  const selectOption = useCallback(
    (option: DropdownOption) => () => {
      onSelectOption(option);
      hideOptions();
    },
    [onSelectOption, hideOptions],
  );

  return (
    <View style={styles.dropdown}>
      <Text style={styles.label}>{label}:</Text>
      <TouchableOpacity onPress={showOptions}>
        <Text ref={selectedOptionRef} style={styles.selectedOption}>
          {selectedOption.label}
        </Text>
      </TouchableOpacity>
      {areOptionsShown && (
        <Modal transparent animationType="fade">
          <Pressable style={styles.dimmer} onPress={hideOptions}>
            <View
              ref={optionsRef}
              style={[
                styles.options,
                {
                  opacity: dropdownPosition === undefined ? 0 : 1,
                  marginTop: dropdownPosition?.y,
                  marginLeft: dropdownPosition?.x,
                },
              ]}
            >
              {options.map(option => (
                <TouchableOpacity
                  key={option.id ?? 'none'}
                  onPress={selectOption(option)}
                  style={[
                    styles.option,
                    {
                      marginTop: option.id === undefined ? 0 : 10,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color:
                          option.id === selectedOption.id
                            ? '#ffffff'
                            : '#bbbbbb',
                        fontWeight:
                          option.id === selectedOption.id ? 'bold' : undefined,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#545454',
  },
  selectedOption: {
    fontSize: 14,
    color: '#121212',
    fontWeight: 'bold',
    paddingVertical: 5,
    marginLeft: 5,
  },
  dimmer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#00000022',
  },
  options: {
    backgroundColor: '#3c3c3cbb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  option: {
    width: 100,
    height: 40,
    backgroundColor: '#323232',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 14,
  },
});

export default Dropdown;
