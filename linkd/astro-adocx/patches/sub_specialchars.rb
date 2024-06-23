require 'asciidoctor' unless RUBY_PLATFORM == 'opal'

module Asciidoctor::Substitutors
  SpecialCharsRx = /[<{&}>]/
  SpecialCharsTr = { '>' => '&gt;', '<' => '&lt;', '&' => '&amp;', '{' => '&lbrace;', '}' => '&rbrace;' }

  def sub_specialchars text
    (text.include? ?>) || (text.include? ?&) || (text.include? ?<) || (text.include? ?{ ) || (text.include? ?}) ? (text.gsub SpecialCharsRx, SpecialCharsTr) : text
  end
end
