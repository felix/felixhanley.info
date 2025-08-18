---
title: ABN verfication code
keywords: [ruby,ABN]
date: 2009-01-15
---

The Australian Business Number (ABN) is a self-checking series of numbers. The
following code verifies an ABN (Ruby for simplicity).

```ruby
class ABN
  @@weight = Array[10,1,3,5,7,89,11,13,15,17,19]

  def initialize(abn)
    @abn = abn
  end

  def valid?
    self.valid?(@abn)
  end

  def self.valid?(abn)
    # strip ws and split on numbers
    abn_array = abn.strip.split(//)
    abn_array[0] = abn_array[0].to_i - 1
    sum = 0
    abn_array.each_index {|x|
      sum += abn_array[x].to_i * @@weight[x]
    }
    sum.remainder(89) == 0
  end
end
```
